import isTouch from './is-touch'

export default function isPhone() {
  /* istanbul ignore next */
  return isTouch() && window.innerWidth <= 800 && window.innerHeight <= 600
}
