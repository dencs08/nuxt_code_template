export function useFile() {
    const { axiosInstance, authorizedAxiosInstance, loading } = useAxios();
    // const { addToast } = useToast();
    const error = ref(null);

    const downloadFile = async (filename) => {
        try {
            const response = await authorizedAxiosInstance.get(`/download/${filename}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            // addToast({ message: 'Something went wrong while downloading your file(s)', duration: 3000, type: 'danger' });
            // console.log(err);
            error.value = err;
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            // addToast({ message: 'Something went wrong while uploading your file(s)', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    return { downloadFile, uploadFile, error };
}