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
        name: 'Analyse',
      },
      {
        url: '/tournaments',
        name: 'Competition',
      },
    ];
  }

  render() {
    const style = {
      borderRadius: 0,
    };
    return (
      <Menu inverted style={ style }>
        <Menu.Item header
                   as={ Link }
                   activeClassName='active'
                   to='/home'
                   name='home'
        >
          Ultimate TTT
        </Menu.Item>

        {
          this.sections.map((section) => (
            <Menu.Item as={ Link } activeClassName='active' to={ section.url } title={ section.name } key={ section.url }>
              { section.name }
            </Menu.Item>
          ))
        }

        <Menu.Menu position='right' icon>
          <Menu.Item href="https://github.com/socialgorithm" target='_blank'>
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
