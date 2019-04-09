export default function isTouch() {
  /* istanbul ignore next */
  const touchevents = document.documentElement.classList.contains('touchevents')
  return touchevents
}
