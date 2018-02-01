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



const sentinelBands = [{
  rasterlayerName: 'B01.jp2',
  search: 'B1',
}, {
  rasterlayerName: 'B02.jp2',
  search: 'B2',
}, {
  rasterlayerName: 'B03.jp2',
  search: 'B3',
}, {
  rasterlayerName: 'B04.jp2',
  search: 'B4',
}, {
  rasterlayerName: 'B05.jp2',
  search: 'B5',
}, {
  rasterlayerName: 'B06.jp2',
  search: 'B6',
}, {
  rasterlayerName: 'B07.jp2',
  search: 'B7',
}, {
  rasterlayerName: 'B08.jp2',
  search: 'B8',
}, {
  rasterlayerName: 'B09.jp2',
  search: 'B9',
}, {
  rasterlayerName: 'B10.jp2',
  search: 'B10',
}, {
  rasterlayerName: 'B11.jp2',
  search: 'B11',
}, {
  rasterlayerName: 'B12.jp2',
  search: 'B12',
}, {
  rasterlayerName: 'B8A.jp2',
  search: 'B8A',
}]


export const getPresentSentinelBands = (formula) => {
  const presentBands = []

  sentinelBands.forEach((band) => {
    if (formula.indexOf(band.search) != -1) {
      presentBands.push(band)
    }
  })

  return presentBands
}