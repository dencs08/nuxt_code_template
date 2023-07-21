export default defineNuxtRouteMiddleware((to, from) => {
    // console.log(from.name + " > " + to.name);
    // if (to.name === "Start") {
    // return navigateTo("/");
    // }
    // const pathNames: string[] = ["Login", "Calendar", "Register", "konto"];
    // if (pathNames.includes(to.name as string)) {
    //     return navigateTo({ name: "PageInProgress" });
    // }

    if (to.path === "/dashboard/" || to.path === "/dashboard") {
        return navigateTo('/dashboard/home');
    }
});
