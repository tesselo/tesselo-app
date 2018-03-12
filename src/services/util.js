import colorbrewer from 'colorbrewer'

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


export const hexToRgb = (hex) => {
  // From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#5624139
  // Remove initial # character.
  if (hex.startsWith('#')) {
    hex = hex.substring(1)
  }
  const bigint = parseInt(hex, 16)
  const rgb = [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ]
  return rgb
}


export const getColorMapParam = (formula) => {
  // Try getting the color palette from color brewer, otherwise use default.
  let palette
  if (formula.colorPalette in colorbrewer) {
    const brew = colorbrewer[formula.colorPalette][9]
    palette = [brew[0], brew[4], brew[8]].map(color => hexToRgb(color))
  } else {
    palette = [[165,0,38], [0,104,55], [249,247,174]]
  }
  // Construct query parameter with color range.
  const colorMapParam = {
    continuous: true,
    range: [formula.minVal, formula.maxVal],
    from: palette[0],
    over: palette[1],
    to: palette[2]
  }
  return encodeURIComponent(JSON.stringify(colorMapParam))
}
