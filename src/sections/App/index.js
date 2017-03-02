import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Header from '../../components/Header';

import './index.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Container>
          { React.Children.toArray(this.props.children) }
        </Container>
      </div>
    );
  }
}

export default App;
