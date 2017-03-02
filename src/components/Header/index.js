import React, { Component } from 'react';
import { Menu, Input, Icon } from 'semantic-ui-react';

class Header extends Component {
  render() {
    return (
      <Menu inverted>
        <Menu.Item header
                   name='home'
        >
          Ultimate TTT Battle
        </Menu.Item>

        <Menu.Menu position='right' icon>
          <Menu.Item href="https://github.com/aurbano/ultimate-ttt-web" target='_blank'>
            <Icon name='github'/>
            Github
          </Menu.Item>
          <Menu.Item>
            <Input icon='lightning' placeholder='http://localhost:3143' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
