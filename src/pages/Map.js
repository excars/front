import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { handleWebSocket, getMe, sendLocation } from '../client'

const SOCKET_OPEN = 'SOCKET_OPEN'
const SOCKET_CLOSE = 'SOCKET_CLOSE'
const LOCATION_UPDATE_INTERVAL = 10000

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: Boolean(window.localStorage.getItem('access_token')),
      usersLocations: [],
      me: null,
      socketState: SOCKET_CLOSE,
      myPosition: {lat: 34.6674943, long: 33.0395057}
    };
  }

  render() {
    if (!this.state.auth) {
      return <Redirect to='/sign-in' />
    }
    const myPosition = {lat: this.state.myPosition.lat, lng: this.state.myPosition.long}
    return (
      <GoogleMap
        defaultZoom={13}
        defaultCenter={myPosition}
      >
        {this.state.me && <Marker label={this.state.me.name}  
          position={myPosition} 
        />}
      </GoogleMap>
    )
  }

  async componentDidMount() {
    this.setState({me: await getMe()})
    if (!window.localStorage.getItem('access_token')) {
      this.setState({auth: false})
      return
    }
    this.socket = handleWebSocket(
      () => {this.setState({socketState: SOCKET_OPEN})},
      () => {this.setState({socketState: SOCKET_CLOSE})}
    )
    this.updateMyPosition()
    this.timerIDMyPosition = setInterval(this.updateMyPosition.bind(this), LOCATION_UPDATE_INTERVAL)
  }

  updateMyPosition() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.setState({myPosition: {lat: position.coords.latitude, long: position.coords.longitude}})
      if (this.state.socketState === SOCKET_OPEN) {
        sendLocation(position, this.socket)
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timerIDMyPosition);
    if (this.socket) {
      this.socket.close()
    }
  }

}

export default withScriptjs(withGoogleMap(Map))