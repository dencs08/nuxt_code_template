export function useLoading() {
    const loading = ref({});

    function startLoading(requestIdentifier) {
        loading.value[requestIdentifier] = true;
        // console.log(loading.value[requestIdentifier]);
    }

    function stopLoading(requestIdentifier) {
        loading.value[requestIdentifier] = false;
        // console.log(loading.value[requestIdentifier]);
    }

    return { loading, startLoading, stopLoading };
}