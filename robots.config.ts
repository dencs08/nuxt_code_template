export default [
    { UserAgent: '*' },
    { Disallow: '/' },
    { BlankLine: true },

    { Sitemap: (req: any) => `${import.meta.env.APP_URL}/sitemap.xml` }
]