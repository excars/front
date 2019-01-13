import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {withScriptjs,  withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import { getMe } from '../states/actions'

export class Map extends Component {
  render() {
    if (!window.localStorage.getItem('access_token')) {
      return <Redirect to='/sign-in' />
    }
    const center = this.props.center
    const me = this.props.me
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={center}
      >
        <Marker position={me.position} />
      </GoogleMap>
    )
  }

  componentDidMount () {
    this.props.getMe()
  }
}
const mapStateToProps = state => {
  return {me: state.me}
}

const mapDispatchToProps = dispatch => {
  return {
    getMe: () => {dispatch(getMe())}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withScriptjs(withGoogleMap(Map)))