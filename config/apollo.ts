// config/businessConfig.ts
export default {
    clientConfigs: {
        default: {
          httpEndpoint: process.env.APOLLO_GRAPHQL_URL || 'http://localhost:1337/graphql',
        }
    }
}