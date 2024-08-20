const isVisible = ref(false);
const config = ref({} as any);

export function useGlobalDialog() {
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

  return {
    isVisible,
    config,
    show,
    hide,
    handleConfirm,
    handleReject,
  };
}
