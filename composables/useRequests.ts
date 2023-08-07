
export function useRequests() {
    const handleRequestError = (response: any) => {
        //returns correct message in string format (debugged and checked)
        if (response.error) throw new Error(response.error.message)
    };

    return { handleRequestError };
}