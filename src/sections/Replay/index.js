import React from 'react';

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
      <div>
        { content }
      </div>
    );
  }
}
export default Replay;
