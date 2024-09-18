import { defineStore } from "pinia";
import { templates, type Template } from "~~/utils/mailTemplates";

export const useEmailTemplatesStore = defineStore("emailTemplates", () => {
  const {
    updateMjmlContent,
    loading,
    error,
    previewHtml,
    mjmlContent,
    generatePreview,
  } = useMail(1000);

  const templatesList = ref<Template[]>(templates);
  const selectedTemplateId = ref(templates[0].id);
  const customValues = ref<Record<string, any>>({});
  const visible = ref(false);
  const templatePreviews = ref<Record<string, string>>({});

  const templateOptions = computed(() =>
    templatesList.value.map((template) => ({
      label: template.label,
      value: template.id,
    }))
  );

  const selectedTemplate = computed(() =>
    templatesList.value.find((t) => t.id === selectedTemplateId.value)
  );

  const handleTemplateChange = (newTemplateId: string) => {
    loading.value = true;
    const newTemplate = templatesList.value.find((t) => t.id === newTemplateId);
    if (newTemplate) {
      selectedTemplateId.value = newTemplateId;
      customValues.value = {};
      if (newTemplate.customFields) {
        Object.keys(newTemplate.customFields).forEach((key) => {
          customValues.value[key] = newTemplate.customFields[key].default || "";
        });
      }
      updateTemplateContent();
    }
  };

  const updateTemplateContent = () => {
    if (selectedTemplate.value) {
      let updatedContent = selectedTemplate.value.content;
      if (selectedTemplate.value.customFields) {
        Object.keys(customValues.value).forEach((key) => {
          const placeholder = `{{${key}}}`;
          updatedContent = updatedContent.replace(
            new RegExp(placeholder, "g"),
            customValues.value[key]
          );
        });
      }
      updateMjmlContent(updatedContent);
    }
  };

  const handleMjmlContentChange = (content: string) => {
    updateMjmlContent(content);
  };

  const getTemplatePreview = async (template: Template) => {
    let previewContent = template.content;
    if (template.customFields) {
      Object.keys(template.customFields).forEach((key) => {
        const placeholder = `{{${key}}}`;
        previewContent = previewContent.replace(
          new RegExp(placeholder, "g"),
          template.customFields[key].default || ""
        );
      });
    }
    const preview = await generatePreview(previewContent);
    templatePreviews.value[template.id] = preview;
  };

  const generateAllPreviews = async () => {
    for (const template of templatesList.value) {
      await getTemplatePreview(template);
    }
  };

  watch(customValues, updateTemplateContent, { deep: true });

  generateAllPreviews();

  return {
    // State
    templates: templatesList,
    selectedTemplateId,
    customValues,
    visible,
    templatePreviews,
    mjmlContent,
    previewHtml,
    loading,
    error,
    templateOptions,
    selectedTemplate,

    // Actions
    handleTemplateChange,
    handleMjmlContentChange,
    generateAllPreviews,
  };
});
