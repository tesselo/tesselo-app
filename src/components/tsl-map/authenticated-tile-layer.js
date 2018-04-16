import L from 'leaflet'
import axios from 'axios'


L.AuthenticatedTileLayer = L.TileLayer.extend({
  createTile: function(coords, done) {
    // Get tile url.
    const url = this.getTileUrl(coords);
    // Instantiate image dom element.
    const tile = document.createElement('img')
    // Bind Leaflet utils to dom element.
    L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile))
    L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile))
    // Assingn cross origin options.
    if (this.options.crossOrigin || this.options.crossOrigin === '') {
      tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin
    }
    // Get auth token from local storage.
    const token = JSON.parse(localStorage.getItem('auth')).token
    // Get tile data using axios and assign result to dom element asynchronously.
    axios({
      method: 'GET',
      url: url,
      headers: {
        'authorization': 'Token ' + token
      },
      responseType: 'blob'
    }).then((response) => {
      tile.src = URL.createObjectURL(response.data)
      done(null, tile)
    })
    // Return image dom element.
    return tile
  }
})

L.authenticatedTileLayer = function(url, options) {
  return new L.AuthenticatedTileLayer(url, options)
}
