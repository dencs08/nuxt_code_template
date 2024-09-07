<template>
  <div class="grid place-content-center h-[80vh]">
    <section class="container mx-auto">
      <div class="card flex justify-center min-w-[50vw]">
        <Stepper v-model:value="activeStep" class="basis-[50rem]" linear>
          <StepList class="w-full flex flex-row justify-center items-center">
            <Step
              v-for="step in 3"
              :key="step"
              :value="step"
              v-slot="{ activateCallback, value, a11yAttrs }"
              asChild
            >
              <div
                :class="[
                  step !== 3
                    ? step !== 1
                      ? 'flex flex-row flex-auto gap-2 pl-2'
                      : 'flex flex-row flex-auto gap-2'
                    : 'pl-2',
                  {
                    'cursor-not-allowed': !canActivateStep(step) || isSubmitted,
                  },
                ]"
                v-bind="a11yAttrs.root"
              >
                <button
                  class="bg-transparent border-0 inline-flex flex-col gap-2"
                  @click="handleStepClick(step, activateCallback)"
                  v-bind="a11yAttrs.header"
                  :disabled="!canActivateStep(step) || isSubmitted"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      !canActivateStep(step) || isSubmitted,
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
                    <i :class="getStepIcon(step)" />
                  </span>
                </button>
                <Divider
                  v-if="step < 3"
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
                v-for="step in 3"
                :key="step"
                :value="step"
                v-slot="{ activateCallback }"
                class="bg-transparent transition duration-500 ease-in-out custom-step-panel"
                :class="{ active: step === activeStep }"
              >
                <div v-if="step === 1">
                  <div
                    class="flex flex-col gap-2 mx-auto"
                    style="min-height: 16rem; max-width: 20rem"
                  >
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                      Setup your password
                    </div>
                    <div class="flex justify-center h-full gap-1 flex-col">
                      <FormWrapper
                        :zodSchema="passwordConfirmSchema"
                        type="form"
                        v-model="passwords"
                        :submit-attrs="{
                          inputClass: 'hidden',
                        }"
                        :incomplete-message="false"
                        :handle-submit="
                          (formData) => {
                            return formData;
                          }
                        "
                        @validation-change="handlePasswordValidationChange"
                      >
                        <div class="space-y-2">
                          <FormKit
                            name="password"
                            type="primePassword"
                            validation="required|length:6"
                            feedback
                            toggleMask
                            placeholder="Password"
                            :disabled="isSubmitted"
                          />

                          <FormKit
                            type="primePassword"
                            name="password_confirm"
                            placeholder="Confirm Password"
                            validation="required|confirm"
                            toggleMask
                            :disabled="isSubmitted"
                          />
                        </div>
                      </FormWrapper>
                    </div>
                  </div>
                </div>
                <div v-else-if="step === 2">
                  <div
                    class="flex flex-col gap-2 mx-auto"
                    style="min-height: 16rem; max-width: 24rem"
                  >
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                      Tell us a little bit more about yourself
                    </div>
                    <FormWrapper
                      :zodSchema="schema"
                      type="form"
                      v-model="details"
                      :submit-attrs="{
                        inputClass: 'hidden',
                      }"
                      :incomplete-message="false"
                      :handle-submit="
                        (formData) => {
                          return formData;
                        }
                      "
                      @validation-change="handleDetailsValidationChange"
                    >
                      <div class="space-y-3">
                        <FormKit
                          name="name"
                          type="primeInputText"
                          validation="required|length:4"
                          placeholder="Name"
                          :disabled="isSubmitted"
                        />

                        <FormKit
                          type="primeInputText"
                          name="nickname"
                          placeholder="nickname"
                          validation="required|length:3"
                          iconPrefix="pi pi-at"
                          :disabled="isSubmitted"
                        />
                      </div>
                    </FormWrapper>
                  </div>
                </div>
                <div v-else-if="step === 3">
                  <div
                    class="flex flex-col gap-2 mx-auto"
                    style="min-height: 16rem; max-width: 24rem"
                  >
                    <div class="text-center mt-4 mb-4">
                      <Icon
                        name="line-md:confirm-circle-twotone"
                        class="text-6xl"
                      ></Icon>
                      <p class="text-xl font-semibold">Success!</p>
                      <p class="text-lg font-medium">
                        Account created successfully
                      </p>
                    </div>
                  </div>
                </div>
              </StepPanel>
            </StepPanels>
          </div>

          <div class="flex justify-center mt-4" v-auto-animate>
            <Button
              v-if="
                activeStep === 1 && isStep1Valid && !isSubmitted && !isLoading
              "
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="validateAndProceed"
              class="transition duration-250"
              :disabled="!isStep1Valid || isSubmitted || isLoading"
            />
            <Button
              v-if="
                activeStep === 2 && isStep2Valid && !isSubmitted && !isLoading
              "
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              @click="submitData"
              :disabled="!isStep2Valid || isSubmitted || isLoading"
            />
            <Button
              v-if="isCompleted"
              label="Home"
              icon="pi pi-home"
              iconPos="right"
              @click="
                () => {
                  navigateTo(localePath('/main'), { replace: true });
                }
              "
            />
          </div>
        </Stepper>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { passwordConfirmSchema } from "~~/utils/schemas";
import { z } from "zod";

definePageMeta({
  layout: "main",
});

const localePath = useLocalePath();
const userStore = useUserStore();
const user = userStore.getUser;

const activeStep = ref(1);
const passwords = ref({ password: "", password_confirm: "" });
const details = ref({ name: "", nickname: "" });

const isStep1Valid = ref(false);
const isStep2Valid = ref(false);
const isSubmitted = ref(false);
const isLoading = ref(false);
const isCompleted = ref(false);

const handlePasswordValidationChange = (isValid: boolean) => {
  isStep1Valid.value = isValid;
};

const handleDetailsValidationChange = (isValid: boolean) => {
  isStep2Valid.value = isValid;
};

const handleStepClick = (step: number, activateCallback: () => void) => {
  if (canActivateStep(step) && !isSubmitted.value && !isLoading.value) {
    activateCallback();
  }
};

const canActivateStep = (step: number) => {
  if (isSubmitted.value || isLoading.value) return false;
  if (step === 1) return true;
  if (step === 2) return isStep1Valid.value;
  if (step === 3) return isStep1Valid.value && isStep2Valid.value;
  return false;
};

const getStepIcon = (step: number) => {
  switch (step) {
    case 1:
      return "pi pi-user";
    case 2:
      return "pi pi-file";
    case 3:
      return "pi pi-check";
    default:
      return "pi pi-circle";
  }
};

const validateAndProceed = () => {
  if (isStep1Valid.value && !isSubmitted.value && !isLoading.value) {
    activeStep.value++;
  }
};

const submitData = async () => {
  if (isStep2Valid.value && !isSubmitted.value && !isLoading.value) {
    try {
      isLoading.value = true;

      const data = await $fetch("/api/me/first-login", {
        method: "POST",
        body: {
          name: details.value.name,
          nickname: details.value.nickname,
          password: passwords.value.password,
          password_confirm: passwords.value.password_confirm,
        },
      });

      // console.log(details.value.name, details.value.nickname);
      // console.log(passwords.value.password, passwords.value.password_confirm);

      isSubmitted.value = true;
      activeStep.value++;
      isCompleted.value = true;
    } catch (error) {
      activeStep.value = 1;
      console.error("Error:", error);
    } finally {
      isLoading.value = false;
    }
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

const schema = z.object({
  name: z.string().min(4).max(30),
  nickname: z.string().min(3).max(20),
});
</script>

<style>
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
}
</style>
