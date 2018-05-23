import React from 'react';

import Header from '../../components/Header';
import SocketContainer from '../../containers/SocketContainer';

import './index.css';

class App extends React.Component {
  render() {
    return (
      <SocketContainer>
        <Header />
        { this.props.children }
      </SocketContainer>
    );
  }
}

export default App;
