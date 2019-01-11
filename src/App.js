import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { SignIn } from './pages'

const NoMatch = ({ location }) => {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

const Home = () => {
  return (
    <div>HOME SWEET HOME</div>
  )
}
const redirect = () => {
  let urlParams = new URLSearchParams(window.location.search);
  
  const auth = fetch(process.env.REACT_APP_AUTH_URL, {
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
  }).then(resp => resp.json()).then(
    data => window.localStorage.setItem('access_token', data.access_token)
  )
  return <Redirect to="/home" />
}



class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/sign-in" exact component={SignIn} />
          <Route path="/home" exact component={Home} />
          <Route path="/" exact component={redirect} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
