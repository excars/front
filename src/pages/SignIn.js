import React, { Component } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

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
  
class OauthRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    if (this.state.loading) {
      return (<div>loading...</div>)
    }
    return <Redirect to="/home" />
  }

  async componentDidMount() {

    const urlParams = new URLSearchParams(window.location.search);
    const resp = await fetch(process.env.REACT_APP_AUTH_URL, {
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
    })
    const data = await resp.json()
    window.localStorage.setItem('access_token', data.access_token)
    this.setState({loading: false})
  }
}

export {SignIn, OauthRedirect};
  