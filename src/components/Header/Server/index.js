import React from 'react';
import { Input } from 'semantic-ui-react';

class Header extends React.Component {
  render() {
    return (
      <Input label='Server' icon='lightning' defaultValue={ this.props.host } />
    );
  }
}

Header.propTypes = {
  host: React.PropTypes.string.isRequired,
};

export default Header;
