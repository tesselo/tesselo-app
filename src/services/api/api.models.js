import { capitalizeFirstLetter } from '@/services/util'
import moment from 'moment'

export const formatError = (errors) => ({
  nonFieldErrors: errors['non_field_errors']
})

export const formatAggregationLayerResults = (rows) => {
  return rows.map(row => ({
    aggregationAreas: row.aggregationareas,
    description: row.description,
    id: row.id,
    maxZoomLevel: row.max_zoom_level,
    minZoomLevel:  row.min_zoom_level,
    modified: row.modified,
    name: row.name,
    nameColumn: row.name_column,
    nrOfAreas: row.nr_of_areas,
    parseLog: row.parse_log,
    shapefile: row.shapefile,
    simplificationTolerance: row.simplification_tolerance,
    bounds: {
      ymin: row.extent[0],
      xmin: row.extent[1],
      ymax: row.extent[2],
      xmax: row.extent[3],
    }
  }))
}

/**
 * Format aggregation area object
 * @param {*} row
 */
export const formatAggregationLayerResult = (row) => {
  return {
    aggregationAreas: row.aggregationareas,
    description: row.description,
    id: row.id,
    maxZoomLevel: row.max_zoom_level,
    minZoomLevel:  row.min_zoom_level,
    modified: row.modified,
    name: row.name,
    nameColumn: row.name_column,
    nrOfAreas: row.nr_of_areas,
    parseLog: row.parse_log,
    shapefile: row.shapefile,
    simplificationTolerance: row.simplification_tolerance,
    bounds: {
      ymin: row.extent[0],
      xmin: row.extent[1],
      ymax: row.extent[2],
      xmax: row.extent[3],
    }
  }
}

export const formatFormulaResults = (rows) => {
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    acronym: row.acronym,
    formula: row.formula,
    minVal: row.min_val,
    maxVal: row.max_val,
    breaks: row.breaks,
    colorPalette: row.color_palette
  }))
}

/**
 * Format formula
 * @param {*} row
 */
export const formatFormulaResult = (row) => {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    acronym: row.acronym,
    formula: row.formula,
    minVal: row.min_val,
    maxVal: row.max_val,
    breaks: row.breaks,
    colorPalette: row.color_palette
  }
}

export const formatCompositesList = (rows) => {
  return rows.map((row, index)=> ({
    index,
    id: row.id,
    allZones: row.allZones,
    active: row.active,
    rasterlayerLookup: row.rasterlayer_lookup,
    startWeek: row.startWeek,
    maxDate: row.max_date,
    minDate: row.min_date,
    year: row.min_date.substring(0, 4),
    interval: row.interval,
    type: row.interval,
    name: row.name,
    nameToShow: moment(row.min_date).format('MMM'),
  }))
}

export const formatUniquesList = (rows) => {
  return rows.map((row, index)=> ({
    index,
    id: row.id,
    sentineltile_id: row.sentineltile_id,
    active: row.active,
    date: row.date,
    rasterlayerLookup: row.rasterlayer_lookup,
    name: row.date + ' Scene',
    nameToShow: index + 1,
    type: 'unique',
    year: row.date.substring(0, 4),
    angleAltitude: row.angle_altitude,
    angleAzimuth: row.angle_azimuth,
    cloudyPixelPercentage: row.cloudy_pixel_percentage,
    dataCoveragePercentage: row.data_coverage_percentage,
    level: row.level,
    mgrs: row.mgrs,
    status: row.status
  }))
}

/**
 * Format predictedLayerResult
 * @param {*} row
 */
export const predictedLayerResult = (row) => {
  return {
    id: row.id,
    aggregationLayerName: row.aggregationlayer_name,
    classifier: row.classifier,
    sentineltile: row.sentineltile,
    composite: row.composite,
    rasterlayer: row.rasterlayer,
    log: row.log,
    chunksCount: row.chunks_count,
    chunksDone: row.chunks_done,
    classifierName: capitalizeFirstLetter(row.classifier_name),
    classifierType: row.classifier_type,
    sourceName: row.source_name,
    sourceType: row.composite ? 'Composite over ' + row.source_name : 'Scene from ' + row.source_name,
    nameToShow: capitalizeFirstLetter(row.name ? row.name : row.classifier_name),
    legend: row.legend
  }
}

export const predictedLayerResults = (rows) => {
  return rows.map(row => ({
    id: row.id,
    aggregationLayerName: row.aggregationlayer_name,
    classifier: row.classifier,
    sentineltile: row.sentineltile,
    composite: row.composite,
    rasterlayer: row.rasterlayer,
    log: row.log,
    chunksCount: row.chunks_count,
    chunksDone: row.chunks_done,
    classifierName: capitalizeFirstLetter(row.classifier_name),
    classifierType: row.classifier_type,
    sourceName: row.source_name,
    sourceType: row.composite ? 'Composite over ' + row.source_name : 'Scene from ' + row.source_name,
    nameToShow: capitalizeFirstLetter(row.name ? row.name : row.classifier_name),
    legend: row.legend
  }))
}
