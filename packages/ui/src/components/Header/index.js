import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

import ServerContainer from '../../containers/ServerContainer';
import './index.scss';

class Header extends React.Component {
  constructor() {
    super();

    this.sections = [
      {
        url: '/tournament',
        name: 'Tournaments',
        icon: 'game',
      },
      {
        url: '/replay',
        name: 'Analyse',
        icon: 'lab',
      },
    ];
  }

  render() {
    return (
      <Menu stackable inverted className='main-header'>
        <Menu.Item header
                   as='a'
                   className='socialgorithm-logo animated-hue'
                   href='https://socialgorithm.org'
        >
          #socialgorithm
        </Menu.Item>
        {
          this.sections.map((section) => (
            <Menu.Item
                exact={ section.exact }
                as={ NavLink }
                activeClassName='active'
                to={ section.url }
                title={ section.name }
                key={ section.url }
                icon={ section.icon }
                content={ section.name }
            />
          ))
        }
        <Menu.Item href="https://socialgorithm.org/docs/" target='_blank'>
          <Icon name='book'/>
          Documentation
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item href="https://github.com/socialgorithm" target='_blank'>
            <Icon name='github'/>
            Source Code
          </Menu.Item>
          <Menu.Item href="https://socialgorithm-slack.herokuapp.com" target='_blank'>
            <Icon name='slack hash'/>
            Community
          </Menu.Item>
          <Menu.Item href>
            <ServerContainer inverted />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
