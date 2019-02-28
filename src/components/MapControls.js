import React, { Component } from 'react';
import {  Col, Row, Button } from 'react-bootstrap';

export default class MapControls extends Component {

  render() {
    return (
      <Row noGutters={true}>
        <Col>
          <Button size="lg" block onClick={this.props.setRole.bind('driver')}>
            Drive
          </Button>
        </Col>
        <Col>
          <Button size="lg" block onClick={this.props.setRole.bind('hitchhiker')}>
            Catch
          </Button>
        </Col>
      </Row>
    )
  }
}