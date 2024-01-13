export function useErrorHandler() {
    const { addToast } = useToastService();

    const errorHandler = () => {
        onMounted(() => {
            window.addEventListener('unhandledrejection', event => {
                // Prevent default handling (so it doesn't appear in console)
                event.preventDefault();

                const errorMessage = event.reason.message;
                addToast('error', 'Error', errorMessage, 30000);
            });
        });
    };
    return { errorHandler };
}