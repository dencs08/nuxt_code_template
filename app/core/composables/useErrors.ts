// useError.ts
export class CustomError extends Error {
  value: any;

  constructor(message: string, value?: any) {
    super(message);
    this.value = value;
  }
}

export function useCustomError() {
  return { CustomError };
}

export function useErrorHandler() {
  const { addToast } = useToastService();
  const { CustomError } = useCustomError();

  const errorHandler = () => {
    onMounted(() => {
      window.addEventListener("unhandledrejection", (event) => {
        event.preventDefault();
        const error = event.reason;
        if (error instanceof CustomError) {
          const errorMessage = error.message;
          addToast("error", "Error", errorMessage, 30000);
        } else {
          // Do something else
        }
      });
    });
  };
  return { errorHandler };
}
