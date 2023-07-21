export function useRecruitments() {
    const { axiosInstance, authorizedAxiosInstance, loading } = useAxios();
    const { addToast } = useToast();

    const recruitments = ref([]);
    const recruitment = ref({
        recruitment: '',
        company: '',
        description: '',
        job_position: '',
        frequency: null,
        maturity: null,
        location: null,
        status: 'Active',
        contract_type: null,
        interview_type: null,
        pay_type: null,
        start_date: null,
        end_date: null,
        currency: null,
        image: '',
        min_salary: null,
        max_salary: null,
        recruiter_id: null,
        benefits: [],
        skills: [],
        techs: [],
        locations: [],
    });
    const error = ref(null);

    const fetchRecruitments = async () => {
        try {
            const response = await authorizedAxiosInstance.get(`/recruitments`)
            recruitments.value = response.data;
            // console.log(response.data);
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            // console.log(err);
            error.value = err;
        }
    };

    const fetchActiveRecruitments = async () => {
        try {
            const response = await axiosInstance.get(`/recruitments/active`)
            recruitments.value = response.data;
            // console.log(response.data);
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            // console.log(err);
            error.value = err;
        }
    };

    const fetchRecruitment = async (id) => {
        try {
            const response = await axiosInstance.get(`/recruitment/${id}`)
            recruitment.value = response.data;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    const fetchRecruitmentImage = async (file) => {
        try {
            if (!file) return;
            const response = await axiosInstance.get(`/recruitment/image/${file}`)
            // recruitment.value = response.data;
            return response;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    const createRecruitment = async (recruitmentData) => {
        try {
            const response = await authorizedAxiosInstance.post(`/recruitment/create`, recruitmentData);
            // result.value = response.data;
            // console.log(response);
            return response;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    const updateRecruitment = async (id, recruitmentData) => {
        try {
            const response = await authorizedAxiosInstance.patch(`/recruitment/${id}`, recruitmentData);
            addToast({ message: 'Data updated successfully', duration: 3000, type: 'success' });
            return response;
        } catch (err) {
            addToast({ message: 'Something went wrong while updating the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    const deleteRecruitment = async (id) => {
        try {
            const response = await authorizedAxiosInstance.delete(`/recruitment/${id}`);
            // console.log(response);
            return response;
        } catch (err) {
            addToast({ message: 'Something went wrong while deleting the data', duration: 3000, type: 'danger' });
            error.value = err;
        }
    };

    return {
        recruitments, recruitment,
        fetchRecruitments, fetchActiveRecruitments, fetchRecruitment, createRecruitment, updateRecruitment, deleteRecruitment, fetchRecruitmentImage,
        error, loading
    };
}
