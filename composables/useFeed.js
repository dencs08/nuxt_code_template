export function useFeed() {
    const { authorizedAxiosInstance, loading } = useAxios();
    const { addToast } = useToast();
    const error = ref(null)
    const feed = ref(null)

    const fetchFeed = async (length) => {
        try {
            if (length === 0 || !length) length = 10;
            const response = await authorizedAxiosInstance.get(`/feed/activity/${length}`);
            feed.value = response.data.data;
            // console.log(response);
            // return response;
        } catch (err) {
            addToast({ message: 'Something went wrong while fetching feed data.', type: 'danger' });
            error.value = err;
        }
    };

    return { fetchFeed, feed, error, loading }
}