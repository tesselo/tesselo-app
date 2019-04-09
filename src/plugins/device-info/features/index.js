import isTouch from './is-touch'
import isPhone from './is-phone'

export default {
  get isTouch() {
    return isTouch()
  },
  get isPhone() {
    return isPhone()
  },
}
