<template>
  <div class="grid place-content-center h-[80vh]">
    <section class="container mx-auto">
      <div class="card flex justify-center min-w-[50vw]">
        <Stepper v-model:value="activeStep" class="basis-[50rem]" linear>
          <StepList class="w-full flex flex-row justify-center items-center">
            <Step
              v-for="(step, index) in steps"
              :key="index"
              :value="index + 1"
              v-slot="{ activateCallback, value, a11yAttrs }"
              asChild
            >
              <div
                :class="[
                  index !== steps.length - 1
                    ? index !== 0
                      ? 'flex flex-row flex-auto gap-2 pl-2'
                      : 'flex flex-row flex-auto gap-2'
                    : 'pl-2',
                  {
                    'cursor-not-allowed':
                      !canActivateStep(index + 1) || isSubmitted,
                  },
                ]"
                v-bind="a11yAttrs.root"
              >
                <button
                  class="bg-transparent border-0 inline-flex flex-col gap-2"
                  @click="handleStepClick(index + 1, activateCallback)"
                  v-bind="a11yAttrs.header"
                  :disabled="!canActivateStep(index + 1) || isSubmitted"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      !canActivateStep(index + 1) || isSubmitted,
                  }"
                >
                  <span
                    :class="[
                      'rounded-full border w-12 h-12 inline-flex items-center justify-center transition duration-500',
                      {
                        'bg-primary-800 text-surface-50 border-primary-300':
                          Number(value) <= Number(activeStep),
                        'border-surface-200 dark:border-surface-700':
                          Number(value) > Number(activeStep),
                      },
                    ]"
                  >
                    <i :class="step.icon" />
                  </span>
                </button>
                <Divider
                  v-if="index < steps.length - 1"
                  layout="horizontal"
                  :pt="{
                    root: {
                      class: [
                        'relative transition duration-500',
                        'before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:w-full transition',
                        {
                          'before:border-t-2 before:border-primary-800/60 dark:before:border-primary-200 transition-all':
                            Number(value) < Number(activeStep),
                          'before:border-t-1 before:border-surface-200 dark:before:border-primary-800 transition-all':
                            Number(value) >= Number(activeStep),
                        },
                      ],
                    },
                  }"
                />
              </div>
            </Step>
          </StepList>
          <div class="relative" style="height: 225px" v-auto-animate>
            <div
              v-if="isLoading"
              class="flex items-center justify-center z-50 h-48"
            >
              <div>
                <ProgressSpinner
                  style="width: 50px; height: 50px"
                  strokeWidth="3"
                  fill="transparent"
                  animationDuration="1s"
                  aria-label="loading..."
                />
              </div>
            </div>
            <StepPanels v-else>
              <StepPanel
                v-for="(step, index) in steps"
                :key="index"
                :value="index + 1"
                class="bg-transparent transition duration-500 ease-in-out custom-step-panel"
                :class="{ active: index + 1 === activeStep }"
              >
                <slot :name="`step-${index + 1}`" :step-data="step.data" />
              </StepPanel>
            </StepPanels>
          </div>

          <div class="flex justify-center mt-4" v-auto-animate>
            <Button
              v-if="showNextButton"
              :label="activeStep === steps.length ? 'Submit' : 'Next'"
              :icon="
                activeStep === steps.length
                  ? 'pi pi-check'
                  : 'pi pi-arrow-right'
              "
              iconPos="right"
              @click="handleNextClick"
              class="transition duration-250"
              :disabled="!isCurrentStepValid || isSubmitted || isLoading"
            />
          </div>
        </Stepper>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, computed } from "vue";

interface Step {
  icon: string;
  data?: Record<string, any>;
}

interface StepValidations {
  [key: number]: boolean;
}

const props = defineProps<{
  steps: Step[];
  onSubmit: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "step-change", step: number): void;
  (e: "form-submitted"): void;
  (e: "update:step-data", stepIndex: number, data: Record<string, any>): void;
}>();

const activeStep = ref(1);
const stepValidations = reactive<StepValidations>({});
const isSubmitted = ref(false);
const isLoading = ref(false);

const handleValidationChange = (step: number, isValid: boolean) => {
  stepValidations[step] = isValid;
};

const handleStepClick = (step: number, activateCallback: () => void) => {
  if (canActivateStep(step) && !isSubmitted.value && !isLoading.value) {
    activateCallback();
    emit("step-change", step);
  }
};

const canActivateStep = (step: number): boolean => {
  if (isSubmitted.value || isLoading.value) return false;
  for (let i = 1; i < step; i++) {
    if (!stepValidations[i]) return false;
  }
  return true;
};

const isCurrentStepValid = computed(() => {
  return stepValidations[activeStep.value] || false;
});

const showNextButton = computed(() => {
  return (
    activeStep.value <= props.steps.length &&
    !isSubmitted.value &&
    !isLoading.value
  );
});

const handleNextClick = async () => {
  if (isCurrentStepValid.value && !isSubmitted.value && !isLoading.value) {
    if (activeStep.value === props.steps.length) {
      await submitForm();
    } else {
      activeStep.value++;
      emit("step-change", activeStep.value);
    }
  }
};

const submitForm = async () => {
  try {
    isLoading.value = true;
    await props.onSubmit();
    isSubmitted.value = true;
    emit("form-submitted");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(activeStep, () => {
  nextTick(() => {
    const panels = document.querySelectorAll(".custom-step-panel");
    panels.forEach((panel: Element) => {
      const panelElement = panel as HTMLElement;
      panelElement.style.display = "";
    });
  });
});

// Expose methods to parent component
defineExpose({
  setStepValidation: handleValidationChange,
  updateStepData: (stepIndex: number, data: Record<string, any>) => {
    emit("update:step-data", stepIndex, data);
  },
});
</script>

<style scoped>
.custom-step-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateX(20px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  pointer-events: none;
}

.custom-step-panel.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  position: relative;
}
</style>
