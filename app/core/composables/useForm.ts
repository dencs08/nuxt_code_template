interface FormSubmitOptions {
  action: () => Promise<any>;
  successTitle?: string;
  errorTitle?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string | ((error: Error) => string);
}

export const useForm = () => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const { showToast } = useToastService();

  const submit = async ({
    action,
    successTitle = "Success",
    errorTitle = "Error",
    successMessage = "Operation completed successfully",
    errorMessage = "An unknown error occurred",
    showSuccessToast = true,
    showErrorToast = true,
  }: FormSubmitOptions) => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await action();

      if (showSuccessToast) {
        showToast({
          severity: "success",
          summary: successTitle,
          detail: successMessage,
        });
      }

      return result;
    } catch (e) {
      error.value =
        e instanceof Error ? e : new Error("An unknown error occurred");

      if (showErrorToast) {
        const finalErrorMessage =
          typeof errorMessage === "function"
            ? errorMessage(error.value)
            : errorMessage;
        showToast({
          severity: "error",
          summary: errorTitle,
          detail: finalErrorMessage,
        });
      }

      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    submit,
    isLoading,
    error,
  };
};
