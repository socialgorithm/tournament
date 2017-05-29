import React from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';

import ServerContainer from '../../containers/ServerContainer';

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
        url: '/replay',
        name: 'Replay',
      },
      {
        url: '/tournaments',
        name: 'Tournaments',
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
          this.sections.map((section) => (
            <Menu.Item as={ Link } activeClassName='active' to={ section.url } title={ section.name } key={ section.url }>
              { section.name }
            </Menu.Item>
          ))
        }

        <Menu.Item as='a' href='https://socialgorithm.org/ultimate-ttt-docs' title='Ultimate TTT Documentation'>
          Documentation
        </Menu.Item>

        <Menu.Menu position='right' icon>
          <Menu.Item href="https://github.com/aurbano/ultimate-ttt-web" target='_blank'>
            <Icon name='github'/>
            Github
          </Menu.Item>
          <Menu.Item>
            <ServerContainer />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
