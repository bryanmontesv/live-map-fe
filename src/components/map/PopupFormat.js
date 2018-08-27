import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'
import '../../css/buttons.css'

class PopupFormat extends React.Component {
  static propTypes = {
    locationValues: PropTypes.object,
    onClick: PropTypes.func
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

  render () {
    let { location_name, open_time, close_time } = this.props.locationValues

    return (
      <div>
        <div>
          <button className='button popup-button' onClick={this.props.onClick}>Edit</button>
        </div>
        <div> Location Name: {location_name} </div>
        <div> Opens at: {open_time} </div>
        <div> Closes at: {close_time} </div>
        <div>
          Currently: {this.locationAvailability(open_time, close_time) ? 'Open' : 'Closed'}
        </div>
      </div>
    )
  }
}

export default PopupFormat