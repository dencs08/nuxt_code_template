// config/site.ts

export default {
    baseUrl: process.env.BASE_URL || 'sitemap url not set',
    url: process.env.BASE_URL || 'url not set',
    name: process.env.APP_NAME || 'app name not set',
}