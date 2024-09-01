import { ref, markRaw } from "vue";
import { useConfirm } from "primevue/useconfirm";
import type { ConfirmationOptions } from "primevue/confirmationoptions";

// Define a type that can be any function
type AnyFunction = (...args: any[]) => any;

interface CustomConfirmConfig {
  message: string;
  header?: string;
  label?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  severity?: string;
  component?: any;
  target?: any;
  showMessage?: boolean;
  accept?: AnyFunction;
  reject?: AnyFunction;
  onError?: (errorMessage: string) => void;
}

type ConfirmConfig = CustomConfirmConfig & Partial<ConfirmationOptions>;

const isVisible = ref(false);
const config = ref<CustomConfirmConfig>({} as CustomConfirmConfig);

export function useConfirmAction() {
  const confirm = useConfirm();

  const showDialog = (newConfig: CustomConfirmConfig) => {
    config.value = { showMessage: true, ...newConfig };
    isVisible.value = true;
  };

  const hideDialog = () => {
    isVisible.value = false;
    config.value = {} as CustomConfirmConfig;
  };

  const handleConfirm: AnyFunction = (...args: any[]) => {
    if (config.value.accept) {
      config.value.accept(...args);
    }
    hideDialog();
  };

  const handleReject: AnyFunction = (...args: any[]) => {
    if (config.value.reject) {
      config.value.reject(...args);
    }
    hideDialog();
  };

  const confirmAction = (newConfig: ConfirmConfig) => {
    if (newConfig.target) {
      confirm.require({
        target: newConfig.target,
        message: newConfig.message,
        icon: newConfig.icon,
        rejectProps: {
          label: newConfig.rejectLabel || "Cancel",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: newConfig.acceptLabel || "Delete",
          severity: newConfig.severity || "contrast",
        },
        accept: newConfig.accept as AnyFunction,
        reject: newConfig.reject as AnyFunction,
        group: newConfig.group || "popup",
        ...newConfig,
      });
    } else {
      showDialog(newConfig);
    }
  };

  return {
    isVisible,
    config,
    confirmAction,
    hideDialog,
    showDialog,
    handleConfirm,
    handleReject,
  };
}
