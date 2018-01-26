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
  formula: {
    list: {
      url: '/formula',
      method: 'get'
    }
  },
  map: {
    vector: (id) => `https://tesselo.com/api/vtiles/${id}/{z}/{x}/{y}.pbf`,
    algebra: () => {
      return `https://tesselo.com/api/algebra/{z}/{x}/{y}.png?layers=B4=45985,B8=45989&formula=(B8-B4)%2F(B8%2BB4)&colormap=%7B%22continuous%22%3Atrue%2C%22range%22%3A%5B-1%2C1%5D%2C%22from%22%3A%5B165%2C0%2C38%5D%2C%22to%22%3A%5B0%2C104%2C55%5D%2C%22over%22%3A%5B249%2C247%2C174%5D%7D`
    }
  }
}
