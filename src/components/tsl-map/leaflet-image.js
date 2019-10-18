import { queue } from 'd3-queue'
import L from 'leaflet'
import axios from 'axios'


// leaflet-image
export default function leafletImage(map, callback) {

    var hasMapbox = !!L.mapbox

    var dimensions = map.getSize(),
        layerQueue = new queue(1)

    var canvas = document.createElement('canvas')
    canvas.width = dimensions.x
    canvas.height = dimensions.y
    var ctx = canvas.getContext('2d')

    // dummy canvas image when loadTile get 404 error
    // and layer don't have errorTileUrl
    var dummycanvas = document.createElement('canvas')
    dummycanvas.width = 1
    dummycanvas.height = 1
    var dummyctx = dummycanvas.getContext('2d')
    dummyctx.fillStyle = 'rgba(0,0,0,0)'
    dummyctx.fillRect(0, 0, 1, 1)

    // Order tilelayers by zIndex
    var tileLayers = []
    map.eachLayer(function(l) {
      if (l instanceof L.TileLayer){
         tileLayers.push(l)
      }
    })
    var sorted = tileLayers.sort(function(a, b) {
      return parseInt(a.options.zIndex) - parseInt(b.options.zIndex)
    })
    // Trigger rendering for each layer.
    var i
    for (i = 0; i < sorted.length; i++){
      layerQueue.defer(handleTileLayer, sorted[i])
    }

    // layers are drawn in the same order as they are composed in the DOM:
    // tiles, paths, and then markers
    map.eachLayer(drawEsriDynamicLayer)

    if (map._pathRoot) {
        layerQueue.defer(handlePathRoot, map._pathRoot)
    } else if (map._panes) {
        var firstCanvas = map._panes.overlayPane.getElementsByTagName('canvas').item(0)
        if (firstCanvas) { layerQueue.defer(handlePathRoot, firstCanvas) }
    }
    map.eachLayer(drawMarkerLayer)
    layerQueue.awaitAll(layersDone)

    function drawMarkerLayer(l) {
        if (l instanceof L.Marker && l.options.icon instanceof L.Icon) {
            layerQueue.defer(handleMarkerLayer, l)
        }
    }

    function drawEsriDynamicLayer(l) {
        if (!L.esri) return

        if (l instanceof L.esri.DynamicMapLayer) {
            layerQueue.defer(handleEsriDymamicLayer, l)
        }
    }

    function done() {
        callback(null, canvas)
    }

    function layersDone(err, layers) {
        if (err) throw err
        layers.forEach(function (layer) {
            if (layer && layer.canvas) {
                ctx.drawImage(layer.canvas, 0, 0)
            }
        })
        done()
    }

    function handleTileLayer(layer, callback) {
        // `L.TileLayer.Canvas` was removed in leaflet 1.0
        var isCanvasLayer = (L.TileLayer.Canvas && layer instanceof L.TileLayer.Canvas),
            canvas = document.createElement('canvas')

        canvas.width = dimensions.x
        canvas.height = dimensions.y

        var ctx = canvas.getContext('2d'),
            bounds = map.getPixelBounds(),
            zoom = map.getZoom(),
            tileSize = layer.options.tileSize

        if (zoom > layer.options.maxZoom ||
            zoom < layer.options.minZoom ||
            // mapbox.tileLayer
            (hasMapbox &&
                layer instanceof L.mapbox.tileLayer && !layer.options.tiles)) {
            return callback()
        }

        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor()),
            tiles = [],
            j, i,
            tileQueue = new queue(50)

        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                tiles.push(new L.Point(i, j))
            }
        }

        tiles.forEach(function (tilePoint) {
            var originalTilePoint = tilePoint.clone()

            if (layer._adjustTilePoint) {
                layer._adjustTilePoint(tilePoint)
            }

            var tilePos = originalTilePoint
                .scaleBy(new L.Point(tileSize, tileSize))
                .subtract(bounds.min)

            if (tilePoint.y >= 0) {
                if (isCanvasLayer) {
                    var tile = layer._tiles[tilePoint.x + ':' + tilePoint.y]
                    tileQueue.defer(canvasTile, tile, tilePos, tileSize)
                } else {
                    var url = addCacheString(layer.getTileUrl(tilePoint))
                    tileQueue.defer(loadTile, url, tilePos, tileSize)
                }
            }
        })

        tileQueue.awaitAll(tileQueueFinish)

        function canvasTile(tile, tilePos, tileSize, callback) {
            callback(null, {
                img: tile,
                pos: tilePos,
                size: tileSize
            })
        }

        function loadTile(url, tilePos, tileSize, callback) {
          // Instantiate image dom element and set img callbacks.
          var tile = new Image()
          tile.crossOrigin = 'Anonymous'
          tile.onload = function () {
              callback(null, {
                  img: this,
                  pos: tilePos,
                  size: tileSize
              })
          }
          tile.onerror = function (e) {
              // use canvas instead of errorTileUrl if errorTileUrl get 404
              if (layer.options.errorTileUrl != '' && e.target.errorCheck === undefined) {
                  e.target.errorCheck = true
                  e.target.src = layer.options.errorTileUrl
              } else {
                  callback(null, {
                      img: dummycanvas,
                      pos: tilePos,
                      size: tileSize
                  })
              }
          }
          // For tesselo tiles use axios, otherwise simply set the url source.
          const needs_auth = url.includes('localhost') || url.includes('tesselo.com')
          if (needs_auth) {
            // Get tile data using axios and assign result to dom element asynchronously.
            axios({
              method: 'GET',
              url: url,
              headers: {
                authorization: 'Token ' + JSON.parse(localStorage.getItem('auth')).token
              },
              responseType: 'blob'
            }).then((response) => {
              tile.src = URL.createObjectURL(response.data)
            })
          } else {
            tile.src = url
          }
        }

        function tileQueueFinish(err, data) {
            data.forEach(drawTile)
            callback(null, { canvas: canvas })
        }

        function drawTile(d) {
            ctx.drawImage(d.img, Math.floor(d.pos.x), Math.floor(d.pos.y),
                d.size, d.size)
        }
    }

    function handlePathRoot(root, callback) {
        var bounds = map.getPixelBounds(),
            origin = map.getPixelOrigin(),
            canvas = document.createElement('canvas')
        canvas.width = dimensions.x
        canvas.height = dimensions.y
        var ctx = canvas.getContext('2d')
        var pos = L.DomUtil.getPosition(root).subtract(bounds.min).add(origin)
        try {
            ctx.drawImage(root, pos.x, pos.y, canvas.width - (pos.x * 2), canvas.height - (pos.y * 2))
            callback(null, {
                canvas: canvas
            })
        } catch(e) {
            console.error('Element could not be drawn on canvas', root) // eslint-disable-line no-console
        }
    }

    function handleMarkerLayer(marker, callback) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pixelBounds = map.getPixelBounds(),
            minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y),
            pixelPoint = map.project(marker.getLatLng()),
            isBase64 = /^data\:/.test(marker._icon.src),
            url = isBase64 ? marker._icon.src : addCacheString(marker._icon.src),
            im = new Image(),
            options = marker.options.icon.options,
            size = options.iconSize,
            pos = pixelPoint.subtract(minPoint),
            anchor = L.point(options.iconAnchor || size && size.divideBy(2, true))

        if (size instanceof L.Point) size = [size.x, size.y]

        var x = Math.round(pos.x - size[0] + anchor.x),
            y = Math.round(pos.y - anchor.y)

        canvas.width = dimensions.x
        canvas.height = dimensions.y
        im.crossOrigin = 'Anonymous'

        im.onload = function () {
            ctx.drawImage(this, x, y, size[0], size[1])
            callback(null, {
                canvas: canvas
            })
        }

        im.src = url

        if (isBase64) im.onload()
    }

    function handleEsriDymamicLayer(dynamicLayer, callback) {
        var canvas = document.createElement('canvas')
        canvas.width = dimensions.x
        canvas.height = dimensions.y

        var ctx = canvas.getContext('2d')

        var im = new Image()
        im.crossOrigin = 'Anonymous'
        im.src = addCacheString(dynamicLayer._currentImage._image.src)

        im.onload = function() {
            ctx.drawImage(im, 0, 0)
            callback(null, {
                canvas: canvas
            })
        }
    }

    function addCacheString(url) {
        // If it's a data URL we don't want to touch this.
        if (isDataURL(url) || url.indexOf('mapbox.com/styles/v1') !== -1) {
            return url;
        }
        return url + ((url.match(/\?/)) ? '&' : '?') + 'pdfcache=090c7adc359e437bb3a9'
    }

    function isDataURL(url) {
        var dataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!url.match(dataURLRegex);
    }
}
