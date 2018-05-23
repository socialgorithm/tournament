import React from 'react';
import { Container } from 'semantic-ui-react';

import Uploader from './Uploader';
import GameExplorer from './GameExplorer';

class Replay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      log: null,
    };
  }

  onUpload = (file) => {
    this.setState({
      log: file,
    });
  };

  render() {
    let content;
    if (this.state.log) {
      content = (
        <GameExplorer gameData={ this.state.log  } />
      );
    } else {
      content = (
        <Uploader onUpload={ this.onUpload } />
      );
    }

    return (
      <Container fluid style={ { padding: '0 20px' } }>
        { content }
      </Container>
    );
  }
}
export default Replay;
