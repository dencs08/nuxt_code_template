import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ left: 0, top: 0 });
                }, 250);
            });
        }
    },
};
