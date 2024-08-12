// config/linkChecker.ts

export default {
    showLiveInspections: true,
    failOnError: false,
    excludeLinks: [
        '/admin/**'
    ],
    report: {
        // generate both a html and markdown report
        html: true,
        markdown: false,
    }
}