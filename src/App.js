import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import logo from './logo.svg';
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

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/sign-in" exact component={SignIn} />
          <Route path="/" exact component={SignIn} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
