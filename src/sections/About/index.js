import React from 'react';
import { Header } from 'semantic-ui-react';

import UTTTGame from '../../components/UTTTGame';

class About extends React.Component {
  render() {
    return (
      <div>
        <Header as='h1' textAlign='center'>Welcome to the Ultimate Tic Tac Toe Algorithm Competition!</Header>
        <UTTTGame width={ 300 } height={ 300 } />
      </div>
    );
  }
}
export default About;
