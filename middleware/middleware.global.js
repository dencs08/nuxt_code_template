export default defineNuxtRouteMiddleware((to, from) => {
    const localePath = useLocalePath()
    const segments = to.path.split('/')

    // Get the language segment and the rest of the path
    let pathAfterLanguagePrefix

    // Check if the path contains language prefix
    if (segments[1].length === 2 && segments.length > 2) {
        pathAfterLanguagePrefix = '/' + segments.slice(2).join('/')
    } else {
        pathAfterLanguagePrefix = to.path
    }

    // If the path is dashboard or dashboard/ after the language prefix
    if (
        pathAfterLanguagePrefix === '/dashboard' ||
        pathAfterLanguagePrefix === '/dashboard/'
    ) {
        // Navigate to the dashboard/home in the same language
        return navigateTo(localePath('/dashboard/home'))
    }
})
