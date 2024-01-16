export function useErrorHandler() {
    const { addToast } = useToastService();
    const { CustomError } = useCustomError();

    const errorHandler = () => {
        onMounted(() => {
            window.addEventListener('unhandledrejection', event => {
                // Prevent default handling (so it doesn't appear in console)
                event.preventDefault();
                const error = event.reason;
                if (error instanceof CustomError) {
                    const errorMessage = error.message;
                    addToast('error', 'Error', errorMessage, 30000);
                } else {
                    // Do something else
                }
            });
        });
    };
    return { errorHandler };
}