import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import { SignIn, OauthRedirect, Map } from './pages'

const NoMatch = ({ location }) => {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/home" exact component={
            () => <Map 
              googleMapURL={process.env.REACT_APP_GOOGLE_MAP}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `500px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          } />
          <Route path="/sign-in" exact component={SignIn} />
          <Route path="/" exact component={OauthRedirect} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
