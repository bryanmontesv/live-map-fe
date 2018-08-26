import React from 'react'
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from 'react-mapbox-gl'
import config from '../config/index'
import styled from 'styled-components'
import moment from 'moment'
import LocationForm from '../components/locationForm'

import axios from 'axios'
import '../css/map.css'

const StyledPopup = styled.div`
  background: white;
  color: #978ed1;
  padding: 5px;
  border-radius: 2px;
`;

// this token is taken from internet. 
const Map = ReactMapboxGl({ accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA' })
class LiveMap extends React.Component {
  
  constructor(props: Props) {
    super(props);
    this.state = {
      center: [-103.3359, 20.6576],
      zoom: 11.16,
      locations: [],
      location: undefined,
      isEditing: false
    };
  }

  // Extract all locations from database
  componentDidMount() {
    axios.get(`${config.lmbApi}/api/locations`)
      .then((response) => {
        console.log('response', response)
        this.setState({ locations: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  // I use this function just for closing a pop-up if there is a location assigned
  onMapMove (e) {
    if (this.state.location) {
      this.setState({ location: undefined })
    }
    console.log(e)
  }

  /**
   * This function will let you know if at your current time the location is opened or not
   * @param {String} open_time location open time
   * @param {String} close_time location close time 
   */
  locationAvailability (open_time, close_time) {
    const open_at = moment(open_time, 'HH:mm')
    const close_at = moment(close_time, 'HH:mm')
    return moment().isBetween(open_at, close_at)
  }

  // When you click on a marker we should set a location into the state to open a pop-up
  onMarkerClicked (location, e) {
    this.setState({
      // center: [e.lngLat.lng, e.lngLat.lat], // check this behavior
      location
    })
  }

  // when you drag a marker to another place it should be stored on the database.
  onDragEndMarker (location, e) {
    axios.put(`${config.lmbApi}/api/locations`, {
      id: location.id,
      longitude: e.lngLat.lng.toString(),
      latitude: e.lngLat.lat.toString()
    })
    .then(response => {
      const updatedLocation = response.data[0]
      let updateStateLocations = this.state.locations.map(stateLocation => {
        if (stateLocation.id === location.id) {
          return updatedLocation
        }
        return stateLocation
      })
      this.setState({ locations: updateStateLocations, location: undefined })
    })
    .catch(err => {
      console.log('Error trying to update: ', err)
    })
  }

  // setting an style when hovering to the marker
  onMouseHover (cursor: string, { map }: { map: any }) {
    map.getCanvas().style.cursor = cursor;
  }

  editLocation () {
    this.setState({ isEditing: !this.state.isEditing })
  }

  onSubmitLocation (event) {
    let { longitude, latitude, location_name, open_time, close_time, id } = this.state.location

    axios.put(`${config.lmbApi}/api/locations`, {
      id,
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      location_name,
      open_time: moment(open_time, 'HH:mm').format(),
      close_time: moment(close_time, 'HH:mm').format(),
    })
      .then(response => {
        const updatedLocation = response.data[0]
        let updateStateLocations = this.state.locations.map(stateLocation => {
          if (stateLocation.id === id) {
            return updatedLocation
          }
          return stateLocation
        })
        this.setState({ locations: updateStateLocations, isEditing: !this.state.isEditing })
      })
      .catch(err => {
        console.log('Error trying to update: ', err)
      })
    event.preventDefault();
  }

  onLocationValueChange (event) {
    let location = this.state.location || {}
    location[event.target.name] = event.target.value
    this.setState({ location })
  }

  render() {
    const { center, zoom, location, isEditing } = this.state;
    return (
      <Map
        containerStyle={{
          height: '98vh',
          width: '100%'
        }}
        style='mapbox://styles/mapbox/navigation-guidance-day-v2'
        center={center}
        zoom={[zoom]}
        onMoveStart={this.onMapMove.bind(this)} >
        <ZoomControl position="top-left" />
        <a href='/' className='button icon plus loud top'>Add</a>
        <Layer 
          type="symbol"
          id="marker"
          layout={{ "icon-image": "circle-15" }} >
            {this.state.locations.map((location) => (
              <Feature key={location.id}
                onMouseEnter={this.onMouseHover.bind(this, 'pointer')}
                onMouseLeave={this.onMouseHover.bind(this, '')}
                onDragEnd={this.onDragEndMarker.bind(this, location)}
                coordinates={[location.longitude, location.latitude]}
                onClick={this.onMarkerClicked.bind(this, location)}
                draggable={true}
               />
            ))}
        </Layer>
        {location &&
          <Popup
            key={location.id}
            offset={8}
            coordinates={[location.longitude, location.latitude]} >
            <StyledPopup>
              {isEditing ?
              <LocationForm 
              onSubmitForm={this.onSubmitLocation.bind(this)}
              onChange={this.onLocationValueChange.bind(this)}
              locationValues={location} />
              :
              <div>
                <label onClick={this.editLocation.bind(this)}>Edit</label>
                <div> Location Name: {location.location_name} </div>
                <div> Opens at: {location.open_time} </div>
                <div> Closes at: {location.close_time} </div>
                <div>
                  Currently: {this.locationAvailability(location.open_time, location.close_time) ? 'Open' : 'Closed'}
                </div>
              </div>
              }
            </StyledPopup>
          </Popup>
        }
      </Map>
    )
  }
}

export default LiveMap
