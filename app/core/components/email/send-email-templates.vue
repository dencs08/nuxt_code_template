<template>
  <div>
    <Splitter
      style="height: 85vh"
      @resizestart="handleResizeStart"
      @resizeend="handleResizeEnd"
    >
      <SplitterPanel class="p-4 overflow-y-auto" :size="40">
        <VirtualScroller
          :items="emailStore.templates"
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
                    item.id === emailStore.selectedTemplateId,
                },
              ]"
              style="width: 135px"
              @click="emailStore.handleTemplateChange(item.id)"
            >
              <div class="w-full h-[99%] overflow-hidden">
                <iframe
                  :srcdoc="emailStore.templatePreviews[item.id] || loadingHtml"
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
                    name="recipients"
                    validation="required"
                    class="w-full"
                  />
                </div>

                <div>
                  <FormKit
                    label="Title"
                    type="primeInputText"
                    validation="required"
                    id="title"
                    name="title"
                    class="w-full"
                  />
                </div>

                <div>
                  <FormKit
                    label="Signature"
                    type="primeInputText"
                    id="signature"
                    name="signature"
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
                    name="bcc"
                    class="w-full"
                  />
                </div>

                <div>
                  <FormKit
                    id="template-select"
                    type="primeSelect"
                    :options="emailStore.templateOptions"
                    option-label="label"
                    option-value="value"
                    :modelValue="emailStore.selectedTemplateId"
                    @update:modelValue="emailStore.handleTemplateChange"
                    label="Select Template"
                    placeholder="Select a template"
                    class="w-full"
                  />
                </div>
              </div>

              <div v-if="emailStore.selectedTemplate" class="mb-4">
                <h3
                  v-if="emailStore.selectedTemplate.customFields"
                  class="text-lg font-semibold mt-4 mb-2"
                >
                  Customize Template
                </h3>
                <div
                  v-for="(field, key) in emailStore.selectedTemplate
                    .customFields"
                  :key="key"
                  class="mb-2"
                >
                  <FormKit
                    :label="field.label"
                    :type="field.type as any"
                    :id="key as string"
                    v-model="emailStore.customValues[key]"
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
              @click="emailStore.visible = true"
              text
              size="small"
              class="text-muted-color"
              icon="pi pi-pencil"
            />
          </div>
          <div v-if="emailStore.error" class="error mt-4 text-red-500">
            {{ emailStore.error }}
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel v-auto-animate class="relative">
        <div
          v-if="emailStore.loading"
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
          <iframe
            :srcdoc="emailStore.previewHtml"
            class="w-full h-full border-0"
          ></iframe>
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
      v-model:visible="emailStore.visible"
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
            v-model="mjmlContent"
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
import { useEmailTemplatesStore } from "~/core/stores/useMailTemplateStore";
const emailStore = useEmailTemplatesStore();
const {
  templates,
  selectedTemplateId,
  customValues,
  visible,
  templatePreviews,
  mjmlContent,
  previewHtml,
  loading,
  error: storeError,
  templateOptions,
  selectedTemplate,
} = storeToRefs(emailStore);

const isDragging = ref(false);
const loadingHtml =
  '<div style="display: flex; justify-content: center; align-items: center; height: 100%; font-size: 64px;">Loading...</div>';

const recipients = ref("");
const bcc = ref("");
const error = ref<string | null>(null);
const emailSent = ref(false);

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
  // Prevent iframe from capturing mouse events
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
  // Initialize selected template content
  emailStore.handleTemplateChange(selectedTemplateId.value);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
});

const { sendMail } = useMail(1000);
const { submit } = useForm();

const handleSendEmail = async (data: any) => {
  if (!recipients.value) {
    error.value = "Please enter at least one recipient";
    return;
  }

  console.log(data);

  const selectedTemplateValue = selectedTemplate.value;
  await submit({
    action: async () => {
      await sendMail({
        to: recipients.value,
        bcc: bcc.value,
        signature: data.signature,
        subject: data.title || selectedTemplateValue?.label || "Email Subject",
        text: "This is a test email sent using MJML",
        mjmlContent: mjmlContent.value,
      });
      emailSent.value = true;
    },
    successMessage: "Email sent successfully",
  });
};
</script>
