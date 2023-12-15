export function useContact() {
    const { authorizedAxiosInstance, loading } = useAxios();
    // const { addToast } = useToast();

    const error = ref(null);
    const submitting = ref(false);

    const submit = async (formData) => {
        submitting.value = true;
        error.value = null;

        try {
            const response = await authorizedAxiosInstance.post('/mail/contact-form', formData);
            // addToast({ message: 'Email sent - thank you for contacting us!.', duration: 3000, type: 'success' });
            // console.log(response.data);
        } catch (err) {
            // addToast({ message: 'Something went wrong while sending your email, please try again or contact us directly.', duration: 3000, type: 'danger' });
            error.value = err;
        } finally {
            submitting.value = false;
        }
    };

    return {
        error,
        submitting,
        submit
    };
}
