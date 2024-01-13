export async function retryFetch(fetchFunction, maxRetries = 3) {
    const { addToast } = useToastService();
    let retryCount = 0;
    let result = null;

    while (!result && retryCount < maxRetries) {
        result = await fetchFunction();

        if (!result) {
            addToast('warn', 'Warning', 'Failed to fetch, retrying...');
            console.log('Failed to fetch, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before retrying
            retryCount++;
        }
    }

    if (!result) {
        throw new Error(`Failed to fetch after ${maxRetries} attempts`);
    }

    return result;
}