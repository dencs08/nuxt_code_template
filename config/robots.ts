// config/robots.ts

export default [
    { UserAgent: '*' },
    { Disallow: '/' },
    { BlankLine: true },
    { Comment: 'Comment here' },

    { Sitemap: (req: any) => `https://${req.headers.host}/sitemap.xml` }
]