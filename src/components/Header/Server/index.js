import React from 'react';
import PropTypes from 'prop-types';
import { Message, Popup, Grid, Label, Button, Form, Modal, Icon } from 'semantic-ui-react';

class Server extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      host: this.props.host,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      host: nextProps.host,
    });
  }

  handleHostChange = (newHost) => {
    this.setState({
      host: newHost,
    });
  };

  saveChanges = (e) => {
    e.preventDefault();
    this.props.actions.connect(this.state.host);
  };

  render() {
    let status, modalContent;

    if (this.props.status === 'disconnected' || this.props.status === 'connecting') {
      status = (
        <Popup
          content='Click to connect to a server'
          trigger={
            <div>
              <Label circular color='red' empty style={ {marginRight: '10px'} }/>
              { this.props.content || 'Connect' }
            </div>
          }
        />
      );
      const errorMessage = (this.props.error) ? (
        <div>
          <p>Please make sure that you have typed the right host:port, and that the server is running.</p>
          <p><code>{ this.props.error.type }: { this.props.error.message }</code></p>
        </div>
        ) : null;
      modalContent = (
        <Form onSubmit={ this.saveChanges } error={ !!errorMessage } loading={ this.props.status === 'connecting' }>
          <Form.Group inline>
            <label>Server</label>
            <Form.Input value={ this.state.host } onChange={ (e, input) => { this.handleHostChange(input.value);  } } />
            <Form.Button primary>Connect</Form.Button>
          </Form.Group>
          <Message
            error
            icon='warning sign'
            header='Unable to connect'
            content={ errorMessage }
          />
        </Form>
      );
    } else {
      status = (
        <Popup
          trigger={
            <div>
              <Label circular color='green' empty style={ {marginRight: '10px'} }/>
              Connected
            </div>
          }
        >
          <Popup.Content>
            <Label color='green'>
              Server
              <Label.Detail>
                { this.props.host }
              </Label.Detail>
            </Label>
          </Popup.Content>
        </Popup>
      );
      modalContent = (
        <Grid columns={ 2 }>
          <Grid.Column>
            <Label circular color='green' empty style={ {marginRight: '10px'} }/>
            Connected to { this.props.host }
          </Grid.Column>
          <Grid.Column>
            <Button negative onClick={ this.props.actions.disconnect }>Disconnect</Button>
          </Grid.Column>
        </Grid>
      );
    }

    const button = (
      <Button
        basic
        inverted={ this.props.inverted }
        compact
        className='as-text'
        content={ status }
      />
    );

    return (
      <Modal trigger={ button }>
        <Modal.Header>
          <Icon name='lightning' />
          Server connection
        </Modal.Header>
        <Modal.Content>
          { modalContent }
        </Modal.Content>
      </Modal>
    );
  }
}

Server.propTypes = {
  host: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  actions: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    disconnect: PropTypes.func.isRequired,
  }).isRequired
};

export default Server;
