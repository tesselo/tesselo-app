export interface IDeviceInfo {
  isTouch: Boolean,
  isPhone: Boolean
}

declare module 'vue/types/vue' {
  export interface Vue {
    $deviceInfo: IDeviceInfo
  }
}
