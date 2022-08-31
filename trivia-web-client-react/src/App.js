import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

import Navbar from './Navbar';
import Home from './Home'
import Trivia from './Trivia'

class App extends Component {
  constructor(props) {
    super(props);
    this.oktaAuth = new OktaAuth({
      issuer: 'https://dev-354685.oktapreview.com/oauth2/default',
      clientId: '0oahmoqq4dWSLtDhF0h7',
      redirectUri: window.location.origin + '/callback'
    });
  }

  render() {
    return (
        <Router>
            <Security oktaAuth={this.oktaAuth}>
            <Navbar />
            <Container text style={{ marginTop: '7em' }}>
                <Route path="/" exact component={Home} />
                <Route path="/callback" component={LoginCallback} />
                <SecureRoute path="/trivia" component={Trivia} />
            </Container>
            </Security>
      </Router>
    );
  }
}

export default App
