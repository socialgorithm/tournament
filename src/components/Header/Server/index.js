import React from 'react';
import { Message, Grid, Label, Button, Form, Modal, Icon } from 'semantic-ui-react';

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
        <div>
          <Label circular color='red' empty style={ {marginRight: '10px'} }/>
          Connect
        </div>
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
        <div>
          <Label circular color='green' empty style={ {marginRight: '10px'} }/>
          { this.props.host }
        </div>
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

    return (
      <Modal trigger={<Button basic inverted compact>{ status }</Button>}>
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
  host: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
  error: React.PropTypes.shape({
    type: React.PropTypes.string,
    message: React.PropTypes.string,
  }),
  actions: React.PropTypes.shape({
    connect: React.PropTypes.func.isRequired,
    disconnect: React.PropTypes.func.isRequired,
  }).isRequired
};

export default Server;
