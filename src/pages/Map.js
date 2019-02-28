import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withScriptjs, withGoogleMap, GoogleMap,  } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Container, Col, Row } from 'react-bootstrap';

import client from '../client'
import { MapControls } from '../components'
import car from './images/car.png'

const SOCKET_OPEN = 'SOCKET_OPEN'
const SOCKET_CLOSE = 'SOCKET_CLOSE'
const LOCATION_UPDATE_INTERVAL = 10000

export class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null
    this.state = {
      auth: Boolean(window.localStorage.getItem('access_token')),
      usersLocations: [],
      me: null,
      socketState: SOCKET_CLOSE,
      currentZoom: 13,
      myPosition: {lat: 34.6674943, long: 33.0395057},
      role: null,
      mode: 'idle'
    };
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>{this.renderMap()}</Row>
        <Row><Col></Col></Row>
        <MapControls state={{role: this.state.role, mode: this.state.mode}} setRole={this.setRole} />
      </Container>
    )
  } 

  renderMap() {
    if (!this.state.auth) {
      return <Redirect to='/sign-in' />
    }
    const myPosition = {lat: this.state.myPosition.lat, lng: this.state.myPosition.long, heading: this.state.myPosition.heading}
    return (
      <GoogleMap
        defaultZoom={13}
        defaultCenter={myPosition}
        ref={this.onMapMounted.bind(this)} 
        onZoomChanged={this.onZoomChanged.bind(this)}
      >
        {this.state.me && <UserMarker
          position={myPosition}
          zoom={this.state.currentZoom}
          labelAnchor={new window.google.maps.Point(0, 0)}
          labelStyle={{transform:"rotate(90deg)"}}
        />}
      </GoogleMap>
    )
  }

  async setRole (role, destination) {
    await client.setRole(role, destination) 
    this.setState({role, destination})
  }
  
  onMapMounted(ref) {
    this.map = ref
  }

  onZoomChanged() {
    this.setState({'currentZoom': this.map.getZoom()})
  }

  async componentDidMount() {
    this.setState({me: await client.getMe()})
    if (!window.localStorage.getItem('access_token')) {
      this.setState({auth: false})
      return
    }
    client.connect(
      () => {this.setState({socketState: SOCKET_OPEN})},
      () => {this.setState({socketState: SOCKET_CLOSE})}
    )
    this.updateMyPosition()
    this.timerIDMyPosition = setInterval(this.updateMyPosition.bind(this), LOCATION_UPDATE_INTERVAL)
  }

  updateMyPosition() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.setState({myPosition: {
        lat: position.coords.latitude, 
        long: position.coords.longitude,
        heading: position.coords.heading
      }})
    
      if (this.state.socketState === SOCKET_OPEN) {
        client.sendLocation(position)
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timerIDMyPosition);
  }
}

class UserMarker extends Component {
  
  render() {
    const size = this.getSize()
    return (
      <MarkerWithLabel
          position={this.props.position}
          labelAnchor={new window.google.maps.Point(size/2, size/2)}
          labelStyle={{transform:`rotate({this.props.position.heading}deg)`}}
          visible={true}
          opacity={100}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 0
          }}
        >
          <img src={car} alt={this.props.name} 
          height={size} width={size}/>
        </MarkerWithLabel>
    )
  }

  getSize() {
    switch (this.props.zoom) {
      case 22:
      case 21:
      case 20:
      case 19:
      case 18:
        return 40
      case 17:
      case 16:
      case 15:
        return 30
      default:
        return 20
    }
    
  }
}

export default withScriptjs(withGoogleMap(Map))