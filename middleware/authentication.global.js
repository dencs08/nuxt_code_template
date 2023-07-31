export default defineNuxtRouteMiddleware((to, from, next) => {
    // console.log(from.name + " > " + to.name);

    // if (to.matched.some((record) => record.meta.auth)) {
    //     if(getAuth().curentUser){
    //         next();
    //     } else{
    //         alert('sorry, you dont have access');
    //         next("/");
    //     }
    // } else{
    //     next();
    // }
});
