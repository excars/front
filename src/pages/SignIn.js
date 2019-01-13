import React from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const SignIn = () => {
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
  )
}
  
let OauthRedirect = ({ push }) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("code") === null) {
    return <Redirect to="/home" />
  }
  fetch(process.env.REACT_APP_AUTH_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: urlParams.get("code"),
      redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI
    }, null, 2),
    mode: 'cors',
    cache: 'default'
  }).then(
    resp => resp.json()
  ).then(
    data => {
      window.localStorage.setItem('access_token', data.access_token)
      push('/home')
    }
  )
  return <Redirect to="/" />
}

OauthRedirect = connect(null, { push })(OauthRedirect)

export {SignIn, OauthRedirect};
  