import React from 'react';
import { Header } from 'semantic-ui-react';

class Replay extends React.Component {
  render() {
    return (
      <div>
        <Header>Replay past games</Header>
        <p>Here you'll be able to upload game logs to analyse your algorithm's performance.</p>
      </div>
    );
  }
}
export default Replay;
