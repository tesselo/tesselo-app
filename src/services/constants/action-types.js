// Action types constants should be named respecting
// the following structure: <namespace>_<verb>_<property>

/* -------------------------------------
 * App
 * ---------------------------------- */
export const DETECT_DEVICE_TOUCH = 'detectTouchDevice'
export const APP_SET_LOADING = 'setLoading'
export const RESET = 'reset'

/* -------------------------------------
 * Auth
 * ---------------------------------- */
export const AUTH_LOGIN = 'login'
export const AUTH_START = 'start'
export const AUTH_LOGOUT = 'logout'

/* -------------------------------------
 * Aggregation Layer
 * ---------------------------------- */
export const AGGREGATION_LAYER_GET = 'getAggregationLayers'
export const AGGREGATION_LAYER_GET_ID = 'getAggregationLayerID'
export const AGGREGATION_LAYER_SELECT = 'selectAggregationLayer'

/* -------------------------------------
 * FORMULA
 * ---------------------------------- */
export const FORMULA_GET = 'getFormulas'
export const FORMULA_GET_ID = 'getFormulaID'
export const FORMULA_SELECT = 'selectFormula'

/* -------------------------------------
 * Map
 * ---------------------------------- */
export const MAP_RESET = 'resetMap'
export const MAP_SET_BASELAYER = 'setBaseLayer'
export const MAP_SET_L_OPACITY = 'setLOpacity'
export const MAP_SET_P_OPACITY = 'setPOpacity'
export const MAP_SET_ZOOM = 'setMapZoom'
export const MAP_SET_CENTER = 'setMapCenter'
export const MAP_SET_HOME_BOUNDS = 'setHomeBounds'

/* -------------------------------------
 * TIME
 * ---------------------------------- */
export const TIME_GET_LIST = 'getList'
export const TIME_SELECT_MOMENT = 'selectMoment'
export const TIME_SELECT_MOMENT_ID = 'selectMomentId'
export const TIME_SET_ACTIVE_MONTH = 'setActiveMonth'
export const TIME_SET_ACTIVE_YEAR = 'setActiveYear'

/* -------------------------------------
 * Report
 * ---------------------------------- */
export const REPORT_GET_MULTIPLE_REGION = 'getMultipleRegionReport'
export const REPORT_SAVE_MULTIPLE_REGION = 'saveMultipleRegionReport'
export const REPORT_SELECT_MULTIPLE_REGION = 'selectMultipleRegionReport'

/* -------------------------------------
 * Predicted Layer
 * ---------------------------------- */
export const PREDICTED_LAYER_GET = 'getPredictedLayers'
export const PREDICTED_LAYER_GET_ID = 'getPredictedLayerID'
export const PREDICTED_LAYER_SELECT = 'selectPredictedLayer'


/* -------------------------------------
 * Bookmark Folder
 * ---------------------------------- */
export const BOOKMARK_FOLDER_GET = 'getBookmarkFolder'
export const BOOKMARK_FOLDER_SAVE = 'saveBookmarkFolder'
export const BOOKMARK_FOLDER_EDIT = 'editBookmarkFolder'
export const BOOKMARK_FOLDER_DELETE= 'deleteBookmarkFolder'

/* -------------------------------------
 * Bookmark
 * ---------------------------------- */
export const BOOKMARK_SAVE = 'saveBookmark'
export const BOOKMARK_EDIT = 'putBookmark'
export const BOOKMARK_DELETE= 'deleteBookmark'
