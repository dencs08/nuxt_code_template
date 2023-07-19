const toasts = ref([]);

export function useToast() {
    const toastHeight = 70; // height of your toast, including any margins

    function addToast({ message = "Default message", duration = 3000, type = "default" } = {}) {
        const id = Date.now();
        const position = toasts.value.length * toastHeight;

        toasts.value.push({ id, message, position, type });

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }

    function removeToast(id) {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);

        // update the position of remaining toasts
        toasts.value = toasts.value.map((toast, index) => ({
            ...toast,
            position: index * toastHeight
        }));
    }

    return {
        toasts,
        addToast,
        removeToast,
    };
}