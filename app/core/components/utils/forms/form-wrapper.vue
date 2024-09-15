<script setup lang="ts">
import { createZodPlugin } from "@formkit/zod";
import { z, type ZodTypeAny } from "zod";
import { reset } from "@formkit/core";
import { v4 as uuidv4 } from "uuid";
import { ref, reactive, watch, nextTick, toRefs } from "vue";
import debounce from "lodash/debounce";

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

const validateForm = async () => {
  if (!formRef.value) return;

  const result = await schema.safeParseAsync(formData);
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

const { modelValue } = toRefs(props);
let formData = reactive({});

watch(
  modelValue,
  (newValue) => {
    Object.assign(formData, newValue);
  },
  { immediate: true, deep: true }
);

watch(
  formData,
  () => {
    emit("update:modelValue", { ...formData });
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
    v-model="formData"
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
