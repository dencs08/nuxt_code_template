export function useUsers() {
    const { authorizedAxiosInstance } = useAxios();
    const { addToast } = useToast();

    const users = ref([]);
    const user = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchUsers = async () => {
        try {
            const response = await authorizedAxiosInstance.get(`/users`);
            users.value = response.data;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
        loading.value = false;
    };

    const fetchUser = async (id) => {
        try {
            const response = await authorizedAxiosInstance.get(`/account/${id}`);
            user.value = response.data;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
        loading.value = false;
    };

    const createUser = async (userData) => {
        try {
            const response = await authorizedAxiosInstance.post(`/account/create`, userData);
            // result.value = response.data;
            // console.log(response);
            return response;
        } catch (err) {
            console.log(err);
            addToast({ message: err.response.data.message, duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    return { users, user, fetchUsers, fetchUser, createUser, error, loading };
}
