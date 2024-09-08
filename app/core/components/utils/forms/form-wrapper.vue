<script setup lang="ts">
import { createZodPlugin } from "@formkit/zod";
import { z, type ZodTypeAny } from "zod";
import { reset } from "@formkit/core";
import { v4 as uuidv4 } from "uuid";
import { ref, reactive, watch, nextTick } from "vue";

const props = defineProps({
  handleSubmit: {
    type: Function as PropType<(formData: any) => Promise<void>>,
    required: true,
  },
  zodSchema: {
    type: Object as PropType<ZodTypeAny>,
    required: false,
  },
  resetOnSubmit: {
    type: Boolean,
    default: true,
  },
  debounceTime: {
    type: Number,
    default: 300,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);

const formId = ref(uuidv4());
const formRef = ref<HTMLElement | null>(null);
const defaultSchema = z.any();
const schema = props.zodSchema || defaultSchema;

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: any[]) {
    const context = this;

    const later = () => {
      timeout = null;
      func.apply(context, args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

const validateForm = async () => {
  if (!formRef.value) return;

  const result = await schema.safeParseAsync(data);
  emit("validation-change", result.success);
};

const debouncedValidateForm = debounce(validateForm, props.debounceTime);

const [zodPlugin, submitHandler] = createZodPlugin(
  schema,
  async (formData: object) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
    await props.handleSubmit(formData);
    if (props.resetOnSubmit) resetFields();
  }
);

const resetFields = () => {
  reset(formId.value);
};

const data = reactive({ ...props.modelValue });

watch(
  data,
  () => {
    emit("update:modelValue", data);
    nextTick(() => {
      debouncedValidateForm();
    });
  },
  { deep: true }
);

defineExpose({
  validate: debouncedValidateForm,
});
</script>

<template>
  <FormKit
    :id="formId"
    type="form"
    v-model="data"
    :submit-attrs="{
      inputClass: 'btn btn-primary btn-sm w-full',
    }"
    @submit="submitHandler"
    :incomplete-message="false"
    :plugins="[zodPlugin]"
  >
    <div ref="formRef">
      <slot></slot>
    </div>
  </FormKit>
</template>
