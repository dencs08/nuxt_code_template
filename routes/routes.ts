//when changing this file you need to restart the server it doesnt support hot reload yet.

//extending page hook of nuxt
export const routes = [
    {
        name: 'login', //actual page name
        newName: 'login', //assign new name
        path: '/login', //change the path
        file: '@/pages/login.vue', //specify the file
    },
    {
        name: 'contact', //actual page name
        newName: 'contact', //assign new name
        path: '/contact', //change the path
        file: '@/pages/contact.vue', //specify the file
    },
]