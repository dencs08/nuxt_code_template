export function useDate() {
    const formatDate = (dateString) => {
        let date = new Date(dateString);

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0
        let year = date.getFullYear();

        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
    return { formatDate };
}