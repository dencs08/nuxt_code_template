// config/supabase.ts

export default {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_KEY,
    client: {},
    cookieRedirect: true,

};