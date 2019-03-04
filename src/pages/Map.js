import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withScriptjs, withGoogleMap, GoogleMap,  } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { Container, Row } from 'react-bootstrap';

import client from '../client'
import { MapControls } from '../components'
import car from './images/car.png'

const LOCATION_UPDATE_INTERVAL = 10000

export class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null
    this.state = {
      auth: Boolean(window.localStorage.getItem('access_token')),
      usersLocations: [],
      me: null,
      ride: null,
      target: null,
      currentZoom: 13,
      myPosition: {lat: 34.6674943, long: 33.0395057},
    };
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>{this.renderMap()}</Row>
        <MapControls user={this.state.target} setRole={this.setRole.bind(this)} />
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
        onClick={this.onMapClick}
      >
        {this.state.me && <UserMarker
          position={myPosition}
          me={this.state.me}
          onClick={this.onMarkerClick}
          zoom={this.state.currentZoom}
          labelAnchor={new window.google.maps.Point(0, 0)}
          labelStyle={{transform:"rotate(90deg)"}}
        />}
      </GoogleMap>
    )
  }

  onMapClick = () => {
    this.setState({target: null})
  }

  onMarkerClick = (target) => {
    this.setState({target: target})
  }

  async setRole (role) {
    let destination = {
      name: 'Porto Bello',
      latitude: 34.6708917,
      longitude: 33.0419397
    }
    await client.setRole(role, destination) 
    this.setState({role, destination})
    this.setState({me: await client.getMe()})
  }
  
  onMapMounted(ref) {
    this.map = ref
  }

  onZoomChanged() {
    this.setState({'currentZoom': this.map.getZoom()})
  }

  async componentDidMount() {
    let me, ride = await Promise.all([client.getMe(), client.getCurrentRide()])
    this.setState({me})
    if (!window.localStorage.getItem('access_token')) {
      this.setState({auth: false})
      return
    }
    this.setState({ride})
    
    client.connect()
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
    
      client.sendLocation(position)
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
          onClick={this.onClick.bind(this)}
        >
          <img src={car} alt={this.props.name} 
          height={size} width={size}/>
        </MarkerWithLabel>
    )
  }

  async onClick() {
    if (this.props.me) {
      this.props.onClick(this.props.me)      
    } else {
      this.props.onClick(await client.getInfo(this.props))
    }
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