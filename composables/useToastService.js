import { useToast } from 'primevue/usetoast';

export function useToastService() {
    const toast = useToast();

    //severity options: success, info, warn, error
    const addToast = (severity, summary, detail) => {
        toast.add({ severity, summary, detail, life: 3000 })
    }

    return { addToast };
}
