import React from 'react';
import MapStore from '../stores/MapStore';

/**
 * @private
 * @var _mapHandle
 * @var _mapMarkers
 * @description
 * both of these variables are used to global
 * references to google map and map markers
 */

var _mapHandle = null;
var _mapMarkers = [];

/**
 * @class
 * @name ZoopsMapComponent
 * @type Component
 * @extends React.Component
 */
class ZoopsMapComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getStateFromStore();
  }

  componentWillMount () {
    MapStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    MapStore.removeChangeListener(this.onChange.bind(this));
  }

  componentDidMount () {
    var mapOptions = {
      zoom: 8,
      center: {lat: this.state.data.longitude, lng: this.state.data.latitude}
    };

    // lazy loading google map api
    window.onload = () => {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&callback=initialize';
      document.body.appendChild(script);
    };
    /**
     * @function widow.initialize
     * @description - this function is to should be called by google apis
     * on the response
     */

    window.initialize = () => {
      _mapHandle = new window.google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      _mapMarkers = [];
      this.setMapMarkers();
    };
  };
  render () {
    return (
      <div {... this.props} className="tab-content">
        <div id="map-canvas"></div>
      </div>
    );
  }

  onChange () {
    this.setState(this.getStateFromStore());
    this.setMapMarkers();
  }

  setMapMarkers () {
    if (!_mapHandle) return;
    this.clearMarkers();
    var listing = this.state.data.listing || [];
    for (var i = 0; i < listing.length; i++) {
      var coord = {lat: listing[i].latitude, lng: listing[i].longitude};
      var marker = new window.google.maps.Marker({
        position: coord,
        map: _mapHandle,
        title: 'Number of beds:' + listing[i].num_bedrooms
      });
      marker.addListener('click', (event) => {
        _mapHandle.setZoom(14);
        _mapHandle.setCenter(event.latLng);
      });
      _mapMarkers.push(marker);
      _mapHandle.setCenter(marker.getPosition());
    }
  }

  clearMarkers () {
    for (var i = 0; i < _mapMarkers.length; i++) {
      _mapMarkers[i].setMap(null);
    }
    _mapMarkers.length = 0;
  }

  getStateFromStore () {
    return MapStore.getState();
  }
}
export default ZoopsMapComponent;
