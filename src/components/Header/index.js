import React from 'react';
import { Link } from 'react-router';
import { Menu, Input, Icon } from 'semantic-ui-react';

class Header extends React.Component {
  constructor() {
    super();

    this.sections = [
      {
        url: '/stats',
        icon: 'stats',
        name: 'Stats',
      },
      {
        url: '/about',
        name: 'About',
      },
      {
        url: '/replay',
        name: 'Replay',
      },
    ];
  }

  render() {
    return (
      <Menu inverted>
        <Menu.Item header
                   name='home'
        >
          Ultimate TTT Battle
        </Menu.Item>

        {
          this.sections.map((section) => <Menu.Item as={ Link } activeClassName='active' to={ section.url } title={ section.name } key={ section.url }>
            { section.name }
          </Menu.Item>)
        }

        <Menu.Menu position='right' icon>
          <Menu.Item href="https://github.com/aurbano/ultimate-ttt-web" target='_blank'>
            <Icon name='github'/>
            Github
          </Menu.Item>
          <Menu.Item>
            <Input label='Server' icon='lightning' placeholder='http://localhost:3143' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
