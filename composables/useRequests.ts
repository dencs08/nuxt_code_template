
export function useRequests() {
    const handleRequestError = (response: any) => {
        if (response.error) throw new Error(response.error.message)
    };

    return { handleRequestError };
}