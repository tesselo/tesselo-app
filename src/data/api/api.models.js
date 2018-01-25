
export const formatError = (errors) => ({
  nonFieldErrors: errors['non_field_errors']
})

export const formatAggregationAreaResults = (rows) => {
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
