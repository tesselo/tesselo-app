export default {
  /* -------------------------------------
   * AUTH
   * ---------------------------------- */
  auth: {
    login: {
      url: '/token-auth/',
      method: 'post'
    },
    logout: {
      url: '/token-logout/',
      method: 'post'
    }
  },
  /* -------------------------------------
   * AUTH
   * ---------------------------------- */
  aggregationLayer: {
    list: {
      url: '/aggregationlayer',
      method: 'get'
    }
  },
  map: {
    vector: (id) => `https://tesselo.com/api/vtiles/${id}/{z}/{x}/{y}.pbf`
  }
}
