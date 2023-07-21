export function useUserSession() {
    const { getSession } = useAuth();
    const { addToast } = useToast();
    const user = ref({});
    const loading = ref(true);

    getSession().then(obj => {
        user.value = {
            id: obj.id,
            name: obj.name,
            email: obj.email,
            phone: obj.phone,
            role: obj.role,
        }
        loading.value = false;
    }).catch(error => {
        addToast({ message: error.message, type: 'error' })
    });

    return {
        user,
        loading,
    };
}
