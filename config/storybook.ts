// config/storybook.ts

export default {
    url: process.env.STORYBOOK_URL || 'http://localhost:6006',
    storybookRoute: '/__storybook__',
    port: process.env.STORYBOOK_PORT || 6006,
}