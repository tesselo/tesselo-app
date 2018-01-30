/**
 * Get current page domain
 */
export const getDomain = function () {
  if (!window.location.origin) { // Some browsers (mainly IE) does not have this property, so we need to build it manually...
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '')
  }
  return window.location.origin
}

/**
 * Get Node env
 */
export const getEnv = function () {
  return process.env.NODE_ENV
}


export const mockServer = function () {
  return !!process.env.MOCK;
}


export const baseUrl = function () {
  return process.env.API_URL
}


export const capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}