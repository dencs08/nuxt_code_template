import axios from 'axios';

export function useAxios() {
    const config = useRuntimeConfig();
    const { token } = useAuth();

    const { startLoading, stopLoading, loading } = useLoading();

    const createAxiosInstance = (isAuthorized = false) => {
        let headers = {};

        if (isAuthorized) {
            headers['Authorization'] = token.value;
        }

        const axiosInstance = axios.create({
            baseURL: config.public.apiBase,
            headers: headers,
        });

        axiosInstance.interceptors.request.use((config) => {
            const requestIdentifier = `${config.url}_${config.method}`;
            loading.value[requestIdentifier] = true;
            startLoading(requestIdentifier);
            return config;
        }, (error) => {
            // Also stop loading if there's an error
            const requestIdentifier = `${error.config.url}_${error.config.method}`;
            loading.value[requestIdentifier] = false;
            stopLoading(requestIdentifier);
            return Promise.reject(error);
        });

        axiosInstance.interceptors.response.use((response) => {
            const requestIdentifier = `${response.config.url}_${response.config.method}`;
            loading.value[requestIdentifier] = false;
            stopLoading(requestIdentifier);
            return response;
        }, (error) => {
            const requestIdentifier = `${error.config.url}_${error.config.method}`;
            loading.value[requestIdentifier] = false;
            stopLoading(requestIdentifier);
            return Promise.reject(error);
        });

        return axiosInstance;
    };

    const axiosInstance = createAxiosInstance();
    const authorizedAxiosInstance = createAxiosInstance(true);

    return { axiosInstance, authorizedAxiosInstance, loading };
}
