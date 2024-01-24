export function useContact() {
    const { authorizedAxiosInstance, loading } = useAxios();
    const { addToast } = useToastService();

    const error = ref(null);
    const submitting = ref(false);

    const submit = async (formData: any) => {
        submitting.value = true;
        error.value = null;

        try {
            const response = await authorizedAxiosInstance.post("/mail/contact-form", formData);
            addToast("success", "Message sent!", "We will get back to you as soon as possible.");
            // console.log(response.data);
        } catch (err) {
            addToast("error", "Error", "Something went wrong. Please try again later.");
            error.value = err;
        } finally {
            submitting.value = false;
        }
    };

    return {
        error,
        submitting,
        submit,
    };
}
