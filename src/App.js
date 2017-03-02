import React, { Component } from 'react';
import { Menu, Container, Input } from 'semantic-ui-react';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Menu inverted>
          <Menu.Item header
            name='home'
          >
            Ultimate TTT Battle
          </Menu.Item>

          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='lightning' placeholder='http://localhost:3143' />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Container>
          Things...
        </Container>
      </div>
    );
  }
}

export default App;
