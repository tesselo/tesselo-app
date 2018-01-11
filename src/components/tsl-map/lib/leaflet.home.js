/* eslint-disable */
export default (Leaflet) => {
  Leaflet.Map.mergeOptions({
    home: false
  });

  Leaflet.Control.Home = Leaflet.Control.extend({

    options: {
      home: {
        title: 'Home',
        initialZoom: 0,
        initialCenter: []
      }
    },

    handlers: {},

    initialize: function (options) {
      Leaflet.Util.extend(this.options, options);

      this.map = options.map;
    },

    onAdd: function () {
      var className = 'leaflet-control-home';
      var container = this.map.zoomControl._container;

      this.options.home.initialZoom = this.map.options.zoom;
      this.options.home.initialCenter = this.map.options.center;

      if (this.options.home) {
        this._createButton(
          this.options.home.title,
          className,
          container,
          this.goHome,
          this
        );
      }

      return container;
    },

    _createButton: function (title, className, container, fn, context) {
      // add a wrapper
      Leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-home-wrapper', context._map._container.querySelector('.leaflet-top.leaflet-right'));

      var link = Leaflet.DomUtil.create('a', className, context._map._container.querySelector('.leaflet-home-wrapper'));
      link.href = '#';
      link.title = title;

      Leaflet.DomEvent
        .on(link, 'click', Leaflet.DomEvent.stopPropagation)
        .on(link, 'mousedown', Leaflet.DomEvent.stopPropagation)
        .on(link, 'dblclick', Leaflet.DomEvent.stopPropagation)
        .on(link, 'click', Leaflet.DomEvent.preventDefault)
        .on(link, 'click', fn, context);

        return link;
    },

    goHome: function () {
      this._exitFired = false;

      this.map.setView(this.options.home.initialCenter, this.options.home.initialZoom);
    }
  });
}