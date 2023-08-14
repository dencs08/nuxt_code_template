export function withErrorHandler(fn) {
    return async function(...args) {
        const { addToast } = useToastService();

        try {
            return await fn.apply(this, args); // Use apply to bind the context
        } catch (error) {
            console.log('error');
            addToast('error', 'Error', error.message);
            throw error;
        }
    };
}