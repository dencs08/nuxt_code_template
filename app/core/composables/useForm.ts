import { ref } from "vue";
import { useToastService } from "./useToastService"; // Assuming this import exists

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

  const getErrorMessage = (e: unknown): string => {
    if (e instanceof Error) {
      return e.message;
    }
    if (typeof e === "string") {
      return e;
    }
    return "An unknown error occurred";
  };

  const submit = async ({
    action,
    successTitle = "Success",
    errorTitle = "Error",
    successMessage = "Operation completed successfully",
    errorMessage,
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
      const actualErrorMessage = getErrorMessage(e);
      error.value = new Error(actualErrorMessage);

      if (showErrorToast) {
        const finalErrorMessage =
          typeof errorMessage === "function"
            ? errorMessage(error.value)
            : errorMessage || actualErrorMessage;

        showToast({
          severity: "error",
          summary: errorTitle,
          detail: finalErrorMessage,
        });
      }

      isLoading.value = false;
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
