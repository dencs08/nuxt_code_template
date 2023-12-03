import { useToast } from 'primevue/usetoast';

export function useToastService() {
    const toast = useToast();

    //severity options: success, info, warn, error
    const addToast = (severity, summary, detail, life) => {
        toast.add({ severity, summary, detail, life: life ? life : 5000 })
    }

    return { addToast };
}
