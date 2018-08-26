import React from 'react'
import PropTypes from 'prop-types';


class LocationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { location_name, open_time, close_time } = this.props.locationValues
    return (
      <form onSubmit={this.props.onSubmitForm}>
        <div>
          <label>
            Location Name:
            <input type="text" name="location_name" value={location_name} onChange={this.props.onChange} />
          </label>
        </div>
        <div>
          <label>
            Opens at:
            <input type="text" name="open_time" value={open_time} onChange={this.props.onChange} />
          </label>
        </div>
        <div>
          <label>
            Closes at:
            <input type="text" name="close_time" value={close_time} onChange={this.props.onChange} />
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

export default LocationForm