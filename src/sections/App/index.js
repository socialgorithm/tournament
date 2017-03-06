import React from 'react';
import { Container } from 'semantic-ui-react';

import Header from '../../components/Header';
import Socket from '../../containers/SocketContainer';

import './index.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Socket />
        <Container>
          { this.props.children }
        </Container>
      </div>
    );
  }
}

export default App;
