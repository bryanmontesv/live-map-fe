import React from 'react'
import { Marker } from "react-mapbox-gl";

class LiveMarker extends React.Component {

  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      latitude: 20.6576,
      longitude: -103.3359,
      properties: {
        draggable: true,
        name: 'Gonzalitos',
        isOpen: true
      }  
    }
  }
  componentDidMount() {

  }

  render() {
    let { latitude, longitude, draggable, name, isOpen } = this.state
    return (
      <Marker
        coordinates={[longitude, latitude]}
      >
      </Marker>
    )
  }
}

export default LiveMarker