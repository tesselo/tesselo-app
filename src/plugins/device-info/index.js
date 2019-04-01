import featureDetection from './features'

export default {
  install(Vue) {
    Vue.prototype.$deviceInfo = featureDetection
  },
}
