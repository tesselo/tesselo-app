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