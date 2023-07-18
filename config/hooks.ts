import { routes } from '../routes/routes';
export default {
    'pages:extend': (pages:any) => {
        pages.map((page:any) => {
            routes.forEach(route => {
                if (route.name === page.name) {
                    Object.assign(page, {path: route.path, name: route.newName});
                }
            })
        })
    }
};