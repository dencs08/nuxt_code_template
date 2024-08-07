<script setup lang='ts'>
import type { PropType } from 'vue'
import type { FormKitFrameworkContext } from '@formkit/core'

import type { InputNumberBlurEvent, InputNumberProps } from 'primevue/inputnumber'
import { useFormKitInput } from '../composables'

export interface FormKitPrimeInputNumberProps {
  useGrouping?: InputNumberProps['useGrouping']
  min?: InputNumberProps['min']
  max?: InputNumberProps['max']
  minFractionDigits?: InputNumberProps['minFractionDigits']
  maxFractionDigits?: InputNumberProps['maxFractionDigits']
  locale?: InputNumberProps['locale']
  mode?: InputNumberProps['mode']
  currency?: InputNumberProps['currency']
  prefix?: InputNumberProps['prefix']
  suffix?: InputNumberProps['suffix']
  showButtons?: InputNumberProps['showButtons']
  buttonLayout?: InputNumberProps['buttonLayout']
  step?: InputNumberProps['step']
  pt?: InputNumberProps['pt']
  ptOptions?: InputNumberProps['ptOptions']
  unstyled?: InputNumberProps['unstyled']
  placeholder?: InputNumberProps['placeholder']
  wrapperClass?: string
}

const props = defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext & FormKitPrimeInputNumberProps>,
    required: true,
  },
})

const { styleClass, wrapperClass, handleInput } = useFormKitInput(props.context)

function handleBlur(e: InputNumberBlurEvent) {
  props.context?.handlers.blur(e.originalEvent)
}
</script>

<template>
  <div :class="wrapperClass">
    <InputNumber
      v-model="context._value"
      v-bind="context?.attrs"
      :input-id="context.id"
      :disabled="!!context?.disabled"
      :readonly="context?.attrs.readonly ?? false"
      :input-style="context?.attrs.style"
      :input-class="styleClass"
      :tabindex="context?.attrs.tabindex"
      :aria-label="context?.attrs.ariaLabel"
      :aria-labelledby="context?.attrs.ariaLabelledby"
      :placeholder="context.placeholder"
      :use-grouping="context.useGrouping ?? true"
      :min="context.min ?? undefined"
      :max="context.max ?? undefined"
      :min-fraction-digits="context.minFractionDigits ?? undefined"
      :max-fraction-digits="context.maxFractionDigits ?? undefined"
      :locale="context.locale ?? undefined"
      :mode="context.mode ?? undefined"
      :currency="context.currency ?? undefined"
      :prefix="context.prefix ?? undefined"
      :suffix="context.suffix ?? undefined"
      :show-buttons="context.showButtons ?? undefined"
      :button-layout="context.buttonLayout ?? 'stacked'"
      :step="context.step ?? undefined"
      :pt="context.pt"
      :pt-options="context.ptOptions"
      :unstyled="context.unstyled ?? false"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>
