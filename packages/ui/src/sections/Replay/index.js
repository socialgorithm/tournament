import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

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
      <Grid.Row columns={ 2 }>
        <Grid.Column>
          { content }
        </Grid.Column>
      </Grid.Row>
    );
  }
}
export default Replay;
