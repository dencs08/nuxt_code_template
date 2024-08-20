const isVisible = ref(false);
const config = ref({} as any);

export function useDialogConfirm() {
  const show = (newConfig: any) => {
    config.value = { ...newConfig };
    isVisible.value = true;
  };

  const hide = () => {
    isVisible.value = false;
    config.value = {};
  };

  const handleConfirm = (value?: any) => {
    if (config.value.accept) {
      config.value.accept(value);
    }
    hide();
  };

  const handleReject = () => {
    if (config.value.reject) {
      config.value.reject();
    }
    hide();
  };

  const handleError = (errorMessage: string) => {
    if (config.value.onError) {
      config.value.onError(errorMessage);
    }
    // Don't hide the dialog on error
  };

  return {
    isVisible,
    config,
    show,
    hide,
    handleConfirm,
    handleReject,
    handleError,
  };
}
