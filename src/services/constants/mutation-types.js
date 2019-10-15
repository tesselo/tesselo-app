// Mutation types constants should be named respecting
// the following structure: <namespace>_<verb>_<property>

/**
 * GLOBAL
 */
export const RESET_STORE = 'resetStore'

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
export const AGGREGATION_LAYER_SET_LAYER_ID= 'setLayerId'
export const AGGREGATION_LAYER_SELECT_LAYER = 'selectLayer'
export const AGGREGATION_LAYER_RESET = 'resetAggregationLayer'

/* -------------------------------------
 * Formula
 * ---------------------------------- */
export const FORMULA_SET_FORMULAS = 'setFormulas'
export const FORMULA_ID_SET= 'setFormulaId'
export const FORMULA_SELECT_FORMULA = 'selectFormula'
export const FORMULA_RESET = 'resetFormula'

/* -------------------------------------
 * MAP
 * ---------------------------------- */
export const MAP_RESET = 'resetMap'
export const MAP_SET_BASELAYER = 'setBaseLayer'
export const MAP_SET_L_OPACITY = 'setLOpacity'
export const MAP_SET_P_OPACITY = 'setPOpacity'
export const MAP_SET_ZOOM = 'setMapZoom'
export const MAP_SET_CENTER = 'setMapCenter'
export const MAP_SET_HOME_BOUNDS = 'setMapHomeBounds'

/* -------------------------------------
 * TIME
 * ---------------------------------- */
export const TIME_SET_LIST = 'setList'
export const TIME_SET_SELECTED_MOMENT = 'setSelectedMoment'
export const TIME_SET_SELECTED_MOMENT_ID = 'setSelectedMomentId'
export const TIME_RESET = 'resetTime'
export const TIME_SET_ACTIVE_MONTH = 'setActiveMonth'
export const TIME_SET_ACTIVE_YEAR = 'setActiveYear'

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
export const PREDICTED_LAYER_SET_ID_LAYER= 'setLayerId'
export const PREDICTED_LAYER_RESET = 'resetPredictedLayer'

/* -------------------------------------
 *  Bookmark Folder
 * ---------------------------------- */
export const BOOKMARK_FOLDER_SET = 'setBookmarkFolder'
export const BOOKMARK_FOLDER_DELETE = 'deleteBookmarkFolder'
export const BOOKMARK_FOLDER_RESET = 'resetBookmarkFolder'

/* -------------------------------------
 *  Bookmark Folder
 * ---------------------------------- */
export const BOOKMARK_SET = 'setBookmark'
export const BOOKMARK_DELETE = 'deleteBookmark'
export const BOOKMARK_RESET = 'resetBookmark'
