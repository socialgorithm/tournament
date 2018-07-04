import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

import ServerContainer from '../../containers/ServerContainer';
import './index.css';

class Header extends React.Component {
  constructor() {
    super();

    this.sections = [
      {
        url: '/match',
        name: 'Match',
      },
      {
        url: '/replay',
        name: 'Analyse',
      },
    ];
  }

  render() {
    return (
      <Menu inverted className='main-header'>
        <Menu.Item header
                   as='a'
                   href='https://socialgorithm.org'
        >
          #socialgorithm
        </Menu.Item>
        <Menu.Item header
                   as={ NavLink }
                   activeClassName='active'
                   to='/'
                   exact
                   name='home'
        >
          Home
        </Menu.Item>

        {
          this.sections.map((section) => (
            <Menu.Item
                exact
                as={ NavLink }
                activeClassName='active'
                to={ section.url }
                title={ section.name }
                key={ section.url }
            >
              { section.name }
            </Menu.Item>
          ))
        }

        <Menu.Menu position='right' icon>
          <Menu.Item href="https://github.com/socialgorithm" target='_blank'>
            <Icon name='github'/>
          </Menu.Item>
          <Menu.Item href="https://socialgorithm.org/ultimate-ttt-docs" target='_blank'>
            <Icon name='book'/>
            Docs
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
