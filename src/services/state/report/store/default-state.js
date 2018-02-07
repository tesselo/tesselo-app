export default {
  reports: {},
  savedReports: JSON.parse(window.localStorage.getItem('savedReports')) || {},
  selectedReport: null
}
