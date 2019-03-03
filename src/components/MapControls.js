import React, { Component } from 'react';
import {  Col, Row, Button, Image } from 'react-bootstrap';

export default class MapControls extends Component {

  render() {
    if (!this.props.me || !this.props.me.role) {
      return this.renderSetRole()
    }
    return this.renderInfo(this.props.me)
  }

  renderInfo(profile) {
    return (
      <Row noGutters={true}>
        <Col>
          {profile.name}
        </Col>
        <Col>
          {profile.role}
        </Col>
      </Row>
    )
  }

  renderSetRole() {
    return (
      <Row noGutters={true}>
        <Col>
          <Button size="lg" block onClick={this.setRoleDrive.bind(this)}>
            Drive
          </Button>
        </Col>
        <Col>
          <Button size="lg" block onClick={this.setRoleCatch.bind(this)}>
            Catch
          </Button>
        </Col>
      </Row>
    )
  }

  async setRoleDrive() {
    await this.props.setRole('driver')
  }

  async setRoleCatch() {
    await this.props.setRole('hitchhiker')
  }
}