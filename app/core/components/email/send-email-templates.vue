<template>
  <div>
    <Splitter
      style="height: 85vh"
      @resizestart="handleResizeStart"
      @resizeend="handleResizeEnd"
    >
      <SplitterPanel class="p-4" :size="40">
        <VirtualScroller
          :items="templates"
          :itemSize="135"
          orientation="horizontal"
          class="border border-surface-200 dark:border-surface-700 rounded mb-4"
          style="width: 100%; height: 200px"
          :pt="{ content: 'flex flex-row' }"
        >
          <template v-slot:item="{ item, options }">
            <div
              :class="[
                'flex flex-col items-center p-2 cursor-pointer',
                { 'bg-surface-0 dark:bg-surface-700': options.odd },
                {
                  'border-2 border-primary bg-surface-100 scale-105':
                    item.id === selectedTemplateId,
                },
              ]"
              style="width: 135px"
              @click="handleTemplateChange(item.id)"
            >
              <div class="w-full h-[99%] overflow-hidden">
                <iframe
                  :srcdoc="templatePreviews[item.id] || loadingHtml"
                  class="w-full h-full"
                  style="
                    pointer-events: none;
                    transform: scale(0.25);
                    transform-origin: top left;
                    width: 400%;
                    height: 500%;
                  "
                ></iframe>
              </div>
            </div>
          </template>
        </VirtualScroller>

        <div class="col-span-6">
          <FormWrapper
            :handle-submit="handleSendEmail"
            submit-label="Send MJML Email"
            :submitAttrs="{ inputClass: 'btn btn-contrast' }"
          >
            <div>
              <div class="flex flex-col gap-1 mb-1">
                <div>
                  <FormKit
                    label="Recipients"
                    type="primeAutoComplete"
                    multiple
                    :typeahead="false"
                    id="recipients"
                    v-model="recipients"
                    placeholder="To"
                    class="w-full"
                  />
                </div>

                <div>
                  <FormKit
                    label="BCC"
                    type="primeAutoComplete"
                    multiple
                    :typeahead="false"
                    id="bcc"
                    v-model="bcc"
                    placeholder="BCC"
                    name="bcc"
                    class="w-full"
                  />
                </div>

                <div>
                  <FormKit
                    id="template-select"
                    type="primeSelect"
                    :options="templateOptions"
                    option-label="label"
                    option-value="value"
                    :modelValue="selectedTemplateId"
                    @update:modelValue="handleTemplateChange"
                    label="Select Template"
                    placeholder="Select a template"
                    class="w-full"
                  />
                </div>
              </div>

              <div v-if="selectedTemplate" class="mb-4">
                <h3
                  v-if="selectedTemplate.customFields"
                  class="text-lg font-semibold mt-4 mb-2"
                >
                  Customize Template
                </h3>
                <div
                  v-for="(field, key) in selectedTemplate.customFields"
                  :key="key"
                  class="mb-2"
                >
                  <FormKit
                    :label="field.label"
                    :type="field.type as any"
                    :id="key as string"
                    v-model="customValues[key]"
                    :placeholder="field.placeholder"
                    class="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </FormWrapper>
          <div class="my-3 text-center">
            <Button
              label="Edit email template code"
              @click="visible = true"
              text
              size="small"
              class="text-muted-color"
              icon="pi pi-pencil"
            />
          </div>
          <div v-if="error" class="error mt-4 text-red-500">{{ error }}</div>
        </div>
      </SplitterPanel>
      <SplitterPanel v-auto-animate class="relative">
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20 transition"
        >
          <ProgressSpinner
            style="width: 65px; height: 65px"
            strokeWidth="3"
            fill="transparent"
            animationDuration="1s"
            aria-label="loading..."
          />
        </div>
        <div v-else class="w-full h-full">
          <iframe :srcdoc="previewHtml" class="w-full h-full border-0"></iframe>
          <div
            v-if="isDragging"
            class="absolute inset-0 bg-transparent z-10"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
          ></div>
        </div>
      </SplitterPanel>
    </Splitter>
    <Dialog
      v-model:visible="visible"
      header="Email template"
      position="left"
      :modal="false"
      draggable
      :style="{ width: '50vw', minWidth: '25rem', maxWidth: '100rem' }"
    >
      <div class="flex items-center gap-4 mb-8">
        <div class="w-full flex-grow">
          <Textarea
            label="MJML Content"
            id="mjml-content"
            :modelValue="mjmlContent"
            @input="handleMjmlContentChange"
            rows="20"
            class="w-full p-2 border rounded"
            placeholder="Enter MJML content here"
          ></Textarea>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { templates, type Template } from "~~/utils/mailTemplates";

const {
  sendMail,
  updateMjmlContent,
  loading,
  previewLoading,
  error,
  previewHtml,
  mjmlContent,
  generatePreview,
} = useMail(1000);

const { addToast } = useToastService();

const selectedTemplateId = ref(templates[0].id);
const recipients = ref("");
const bcc = ref("");
const isDragging = ref(false);
const customValues = ref({});
const visible = ref(false);
const templatePreviews = ref<Record<string, string>>({});

const templateOptions = templates.map((template) => ({
  label: template.label,
  value: template.id,
}));

const selectedTemplate = computed(() =>
  templates.find((t) => t.id === selectedTemplateId.value)
);

const loadingHtml =
  '<div style="display: flex; justify-content: center; align-items: center; height: 100%; font-size: 64px;">Loading...</div>';

const handleResizeStart = () => {
  isDragging.value = true;
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const handleResizeEnd = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (event: MouseEvent) => {
  // This function is empty but necessary to prevent
  // the iframe from capturing mouse events
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
});

const handleTemplateChange = (newTemplateId: string) => {
  loading.value = true;
  const newTemplate = templates.find((t) => t.id === newTemplateId);
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

const handleMjmlContentChange = (event: Event) => {
  const content = (event.target as HTMLTextAreaElement).value;
  updateMjmlContent(content);
};

watch(customValues, updateTemplateContent, { deep: true });

const handleSendEmail = async () => {
  if (!recipients.value) {
    addToast("error", "Error", "Please enter at least one recipient");
    return;
  }

  try {
    const selectedTemplate = templates.find(
      (t) => t.id === selectedTemplateId.value
    );
    await sendMail({
      to: recipients.value,
      bcc: bcc.value,
      subject: selectedTemplate?.label || "Email Subject",
      text: "This is a test email sent using MJML",
      mjmlContent: mjmlContent.value,
    });
    addToast("success", "Success", "Email sent successfully");
    console.log("Email sent successfully");
  } catch (err) {
    addToast("error", "Error", "Failed to send email");
    console.error("Failed to send email:", err);
  }
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

// Generate previews for all templates
const generateAllPreviews = async () => {
  for (const template of templates) {
    await getTemplatePreview(template);
  }
};

onMounted(() => {
  generateAllPreviews();
});

handleTemplateChange(selectedTemplateId.value);
</script>
