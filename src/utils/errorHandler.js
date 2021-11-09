import * as Sentry from "@sentry/vue"

export default {
    routerError(err) {
        if (err.name == 'NavigationDuplicated' && err.message.includes('Avoided redundant navigation to current location')) {
            Sentry.captureException(err)
        } else {
            throw new Error(err)
        }
    }
}