import React from 'react'
import ReactMapboxGl from 'react-mapbox-gl'
import config from '../config/index'
import LiveMarker from '../components/markers'
import axios from 'axios'
import '../css/map.css'

const Map = ReactMapboxGl({ accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA' })



class LiveMap extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: -103.3359,
      lat: 20.6576,
      zoom: 11.16,
      locations: []
    };
  }

  onMoveMap (e) {
    console.log(this, e.getZoom())
  }
    
  componentDidMount() {
    axios.get(`${config.lmbApi}/api/locations`)
      .then((response) => {
        this.setState({ locations: response.data })
      })
      .catch(error => {
        console.log(error)
      })
    console.log('Do it')
  }


  render() {
    const { lng, lat, zoom } = this.state;
    console.log(lng, lat, zoom)
    return (
      <Map
        containerStyle={{
          height: '98vh',
          width: '100%'
        }}
        style='mapbox://styles/mapbox/streets-v9'
        center={[lng, lat]}
        zoom={[zoom]}
        onMove={this.onMoveMap.bind(this)}
      >
        
      </Map>
    )
  }
}

export default LiveMap
