import L from 'leaflet'
// Tile layer class that has token auth requests built in.
import './authenticated-tile-layer'


export const basemapProviders = [
  {
    slug:'BW_OpenStreetMap',
    name: 'B&W OpenStreetMap',
    visible: false,
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    tileLayerClass: L.tileLayer,
    type: "base",
    zIndex: 1,
    isWms: false
  },
  {
    slug:'OpenStreetMap',
    name: 'OpenStreetMap',
    visible: false,
    attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileLayerClass: L.tileLayer,
    type: "base",
    zIndex: 1,
    isWms: false
  },
  {
    slug:'Lines',
    name: 'LinesOverlay',
    visible: false,
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png',
    tileLayerClass: L.tileLayer,
    type: "overlay",
    zIndex: 11,
    isWms: false
  },
  {
    slug:'Labels',
    name: 'LabelsOverlay',
    visible: false,
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png',
    tileLayerClass: L.tileLayer,
    type: "overlay",
    zIndex: 12,
    isWms: false
  },
  {
    slug: 'NAIP_RGB',
    name: 'NAIP RGB',
    visible: false,
    attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
    url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255',
    tileLayerClass: L.authenticatedTileLayer,
    type: "base",
    zIndex: 1,
    isWms: false
  },
  {
    slug: 'NAIP_GRAYSCALE',
    name: 'NAIP Grayscale',
    visible: false,
    attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
    url: '/api/naip/{z}/{x}/{y}.png?alpha&scale=0,255&enhance_color=0',
    tileLayerClass: L.authenticatedTileLayer,
    type: "base",
    zIndex: 1,
    isWms: false
  },
  {
    slug: 'NAIP_NDVI',
    name: 'NAIP NDVI',
    visible: false,
    attribution: '<a target="_blank" href="http://www.fsa.usda.gov/">USDA Farm Service Agency</a>',
    url: '/api/naip/{z}/{x}/{y}.png?formula=(B4-B1)/(B1%2BB4)&colormap=%7B"continuous":true,"range":[-0.9,0.9],"from":[165,0,38],"to":[0,104,55],"over":[249,247,174]%7D',
    tileLayerClass: L.authenticatedTileLayer,
    type: "base",
    zIndex: 1,
    isWms: false
  },
  {
    base_url: "https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer",
    slug:'USGS_Imagery',
    name: 'USGS Imagery',
    visible: false,
    layers: "0",
    attribution: "USGS The National Map: Orthoimagery. Data refreshed April, 2019.",
    type: "base",
    format: "image/jpeg",
    zIndex: 1,
    isWms: true
  },
  {
    base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
    slug:'Hillshade_Gray',
    name: 'USGS Hillshade Gray',
    visible: false,
    layers: "3DEPElevation:Hillshade Gray",
    attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
    type: "base",
    format: "image/jpeg",
    zIndex: 1,
    isWms: true
  },
  {
    base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
    slug:'Hillshade_Multidirectional',
    name: 'USGS Hillshade Multidirectional',
    visible: false,
    layers: "3DEPElevation:Hillshade Multidirectional",
    attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
    type: "base",
    format: "image/jpeg",
    zIndex: 1,
    isWms: true
  },
  {
    base_url: "https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer",
    slug:'Hillshade_Tinted',
    name: 'USGS Hillshade Tinted',
    visible: false,
    layers: "3DEPElevation:Hillshade Elevation Tinted",
    attribution: "USGS National Map 3D Elevation Program (3DEP). Data refreshed July, 2018.",
    type: "base",
    format: "image/jpeg",
    zIndex: 1,
    isWms: true
  },
  {
    base_url: "http://cartografia.dgterritorio.gov.pt/ortos2018/service?",
    slug:'DGTOrtos2018',
    name: 'DGT Ortofotos 2018',
    visible: false,
    layers: "Ortos2018-RGB",
    attribution: "DGT Ortofotos 2018.",
    format: "image/png",
    type: "base",
    zIndex: 1,
    isWms: true
  }
];
