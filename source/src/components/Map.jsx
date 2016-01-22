import React from 'react';
import MapStore from '../stores/MapStore';

class ZoopsMapComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getStateFromStore();
    this.map = null;
    this.markers = null;
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

    window.onload = () => {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&callback=initialize';
      document.body.appendChild(script);
    };

    window.initialize = () => {
      this.map = new window.google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      this.markers = [];
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
    if (!this.map) return;
    this.clearMarkers();
    var listing = this.state.data.listing || [];
    for (var i = 0; i < listing.length; i++) {
      var coord = {lat: listing[i].latitude, lng: listing[i].longitude};
      var marker = new window.google.maps.Marker({
        position: coord,
        map: this.map,
        title: 'location'
      });
      marker.addListener('click', (event) => {
        this.map.setZoom(14);
        this.map.setCenter(event.latLng);
      });
      this.markers.push(marker);
      this.map.setCenter(marker.getPosition());
    }
  }

  clearMarkers () {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  getStateFromStore () {
    return MapStore.getState();
  }
}
export default ZoopsMapComponent;
