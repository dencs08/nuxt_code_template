export function useDate() {
  const formatDate = (
    dateString: string,
    options: { includeTime?: boolean; padZeroes?: boolean } = {
      includeTime: false,
      padZeroes: true,
    }
  ) => {
    let date = new Date(dateString);

    let day = options.padZeroes
      ? String(date.getDate()).padStart(2, "0")
      : String(date.getDate());
    let month = options.padZeroes
      ? String(date.getMonth() + 1).padStart(2, "0")
      : String(date.getMonth() + 1); // January is 0
    let year = date.getFullYear();

    let formattedDate = `${day}-${month}-${year}`;

    if (options.includeTime) {
      let hours = options.padZeroes
        ? String(date.getHours()).padStart(2, "0")
        : String(date.getHours());
      let minutes = options.padZeroes
        ? String(date.getMinutes()).padStart(2, "0")
        : String(date.getMinutes());
      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  };

  return { formatDate };
}
