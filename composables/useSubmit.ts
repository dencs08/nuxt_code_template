export function useSubmit() {
  const { addToast } = useToastService();
  const localePath = useLocalePath();

  const defaultSuccessHandler =
    (message: string, redirectPath?: string, external?: boolean) =>
    (response: any) => {
      addToast("success", "Success", message);
      if (redirectPath) {
        navigateTo(localePath(redirectPath), { external: external ?? false });
      }
    };

  const defaultErrorHandler = (error: any) => {
    const errorMessage = error.message || "An unknown error occurred.";
    addToast("error", "Error", errorMessage, 30000);
  };

  async function handleSubmit(
    action: (data: any) => Promise<any>,
    data: any,
    successMessage: string,
    redirectPath?: string,
    external?: boolean,
    errorMessage?: string,
    captchaToken?: string,
    onSuccess: (response: any) => void = defaultSuccessHandler(
      successMessage,
      redirectPath,
      external
    ),
    onError: (error: any) => void = defaultErrorHandler
  ) {
    try {
      const requestData = captchaToken ? { ...data, captchaToken } : data;
      const response = await action(requestData);
      onSuccess(response);
    } catch (error) {
      onError(error);
    }
  }

  return { handleSubmit };
}
