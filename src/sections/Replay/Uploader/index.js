import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Segment, Message } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';

import './index.css';

class Uploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      loading: false,
      errors: null,
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (!acceptedFiles || acceptedFiles.length < 1) {
      return this.setState({
        errors: null,
      });
    }
    if (acceptedFiles.length > 1) {
      return this.setState({
        errors: 'Upload only one file please',
      });
    }

    const file = acceptedFiles[0];
    const ext = file.name.split('.').pop();
    if (ext !== 'log') {
      return this.setState({
        errors: 'Please make sure you are uploading a .log file (Uploaded file: ' + file.name + ')',
      });
    }

    this.readFile(file);
  };

  readFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        loading: false,
      });
      this.props.onUpload(reader.result);
    };
    reader.onloadstart = () => {
      this.setState({
        loading: true,
      });
    };
    reader.onerror = (error) => {
      this.setState({
        errors: 'Error uploading file: ' + file.name + ' - ' + error,
      });
    };
    reader.readAsText(file);
  };

  render() {
    let errorMessage = null;
    if (this.state.errors) {
      errorMessage = (
        <Message negative attached='bottom'>
          <Icon name='warning sign' />
          { this.state.errors }
        </Message>
      );
    }
    return (
      <div>
        <Header>Replay past games</Header>
        <p>Here you'll be able to upload game logs to analyse your algorithm's performance.</p>
        <Dropzone
          className='dropzone'
          multiple={ false }
          onDrop={this.onDrop}
        >
          <Segment loading={ this.state.loading } className='upload-box' attached={ !!errorMessage }>
            <p><Icon name='cloud upload' size='big' /></p>
            <p>Click here, or drop a log file to upload a game log.</p>
          </Segment>
          { errorMessage }
        </Dropzone>
      </div>
    );
  }
}

Uploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default Uploader;
