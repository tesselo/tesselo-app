
export const formatError = (errors) => ({
  nonFieldErrors: errors['non_field_errors']
})

export const formatAggregationAreaResults = (rows) => {
  return rows.map(row => ({
    aggregationAreas: row.aggregationAreas,
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
      xmin: row.extent[0],
      ymin: row.extent[1],
      xmax: row.extent[2],
      ymax: row.extent[3],
    }
  }))
}
