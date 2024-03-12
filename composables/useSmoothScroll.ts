export function useSmoothScroll() {
    const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth') => {
        const element = document.getElementById(elementId);

        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - 75;

            window.scrollTo({ top: y, behavior });
        }
    }

    onMounted(() => {
        const hash = ref(window.location.hash)

        if (hash.value) {
            scrollToElement(hash.value.slice(1))
        }

        window.onhashchange = () => {
            scrollToElement(window.location.hash.slice(1))
        }
    })

    return {
        scrollToElement
    }
}