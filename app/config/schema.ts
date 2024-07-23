// config/schemaorg.ts

export default {
    identity: {
        type: process.env.APP_TYPE || 'app type not set',
        name: process.env.APP_NAME || 'name not set',
        url: process.env.BASE_URL || 'url not set',
        logo: process.env.APP_LOGO_URL || 'logo not set',
      }
};