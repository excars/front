import React, { Component } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';

class SingIn extends Component {
    render() {
      return (
        <Container>
          <Row >
            <Col/><Col md="auto" style={{height: '100px'}}>
              <form method="GET" action={process.env.REACT_APP_GOOGLE_OAUTH2_URL}>
              <input type="hidden" name="client_id" value={process.env.REACT_APP_GOOGLE_CLIENT_ID}/>
              <input type="hidden" name="redirect_uri" value={process.env.REACT_APP_GOOGLE_REDIRECT_URI}/>
              
              <input type="hidden" name="scope" value="profile email"/>
              <input type="hidden" name="state" value="try_sample_request"/>
              <input type="hidden" name="response_type" value="code"/>
              <Button type="submit" size="lg">
                Sign in with Google
              </Button>
              </form>
            </Col><Col/>
          </Row>
        </Container>
      );
    }
  }
  
  export default SingIn;
  