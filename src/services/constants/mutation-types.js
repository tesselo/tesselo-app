// Mutation types constants should be named respecting
// the following structure: <namespace>_<verb>_<property>

/* -------------------------------------
 * App
 * ---------------------------------- */
export const SET_DEVICE_TOUCH = 'setDeviceTouch'
export const SET_LOADING_VISIBILITY = 'setLoadingVisibility'


/* -------------------------------------
 * Auth
 * ---------------------------------- */
export const AUTH_SET_AUTHENTICATION = 'setAuthetication'
export const AUTH_REMOVE_AUTHENTICATION = 'removeAuthentication'

/* -------------------------------------
 * Aggregation Layer
 * ---------------------------------- */
export const AGGREGATION_LAYER_SET_LAYERS = 'setLayers'
export const AGGREGATION_LAYER_SELECT_LAYER = 'selectLayer'
export const AGGREGATION_LAYER_RESET = 'resetAggregationLayer'

/* -------------------------------------
 * Formula
 * ---------------------------------- */
export const FORMULA_SET_FORMULAS = 'setFormulas'
export const FORMULA_SELECT_FORMULA = 'selectFormula'
export const FORMULA_RESET = 'resetFormula'

/* -------------------------------------
 * MAP
 * ---------------------------------- */
export const MAP_SET_BOUNDS = 'setMapBounds'
export const MAP_RESET = 'resetMap'

/* -------------------------------------
 * TIME
 * ---------------------------------- */
 export const TIME_SET_LIST = 'setList'
 export const TIME_SET_SELECTED_MOMENT = 'setSelectedMoment'
 export const TIME_RESET = 'resetTime'

 /* -------------------------------------
 * Report
 * ---------------------------------- */
export const REPORT_SET_MULTIPLE_REGION = 'setMultipleRegionReport'
export const REPORT_SET_SELECTED_MULTIPLE_REPORT = 'setSelectedMultipleReport'
export const REPORT_SAVE_SELECTED_MULTIPLE_REPORT = 'saveSelectedMultipleReport'
export const REPORT_RESET = 'resetReport'

/* -------------------------------------
 * Predicted Layer
 * ---------------------------------- */
export const PREDICTED_LAYER_SET_LAYERS = 'setLayers'
export const PREDICTED_LAYER_SELECT_LAYER = 'selectLayer'
export const PREDICTED_LAYER_RESET = 'resetAggregationLayer'
