// Action types constants should be named respecting
// the following structure: <namespace>_<verb>_<property>

/* -------------------------------------
 * App
 * ---------------------------------- */
export const DETECT_DEVICE_TOUCH = 'detectTouchDevice'
export const APP_SET_LOADING = 'setLoading'

/* -------------------------------------
 * Auth
 * ---------------------------------- */
export const AUTH_LOGIN = 'login'
export const AUTH_LOGOUT = 'logout'

/* -------------------------------------
 * Aggregation Layer
 * ---------------------------------- */
export const AGGREGATION_LAYER_GET = 'getAggregationLayers'
export const AGGREGATION_LAYER_SELECT = 'selectAggregationLayer'

/* -------------------------------------
 * FORMULA
 * ---------------------------------- */
export const FORMULA_GET = 'getFormulas'
export const FORMULA_SELECT = 'selectFormula'

/* -------------------------------------
 * Map
 * ---------------------------------- */
export const MAP_SET_BOUNDS = 'setMapBounds'


/* -------------------------------------
 * TIME
 * ---------------------------------- */
export const TIME_GET_COMPOSITES = 'getComposites'
export const TIME_GET_UNIQUES = 'getUniques'
export const TIME_SELECT_MOMENT = 'selectMoment'