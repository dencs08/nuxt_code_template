<script setup lang="ts">
import { createZodPlugin } from "@formkit/zod";
import { z, type ZodTypeAny } from "zod";
import { reset } from "@formkit/core";
import { v4 as uuidv4 } from "uuid";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true,
  },
  zodSchema: {
    type: Object as () => ZodTypeAny,
    required: false,
  },
  resetOnSubmit: {
    type: Boolean,
    default: true,
  },
});

const formId = ref(uuidv4());
const formRef = ref<HTMLElement | null>(null);

const defaultSchema = z.any();
const schema = props.zodSchema || defaultSchema;

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

const data = reactive({});
</script>

<template>
  <FormKit
    :id="formId"
    type="form"
    v-model="data"
    :submit-attrs="{ inputClass: 'btn btn-primary btn-sm w-full' }"
    @submit="submitHandler"
    :incomplete-message="false"
    :plugins="[zodPlugin]"
  >
    <div ref="formRef">
      <slot></slot>
    </div>
  </FormKit>
</template>
