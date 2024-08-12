// config/delayHydration.ts

export default {
    // enables nuxt-delay-hydration in dev mode for testing
    // NOTE: you should disable this once you've finished testing, it will break HMR
    //debug: process.env.NODE_ENV === 'development'
    
    // 'init' most risky for 3rd party but 90-100% reduction,
    // 'mount' safer for 3rd party but 70% reduction
    // 'manual' reduction as used
    mode: 'mount', 
};