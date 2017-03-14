import React from 'react';
import { Input, Loader, Label, Popup, Button, Form } from 'semantic-ui-react';

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
    console.log('Received: ', this.props.status, this.props.error);
    if (this.props.status === 'disconnected') {

      const editHost = (
        <Form onSubmit={ this.saveChanges }>
          <Input label='Server' icon='lightning' value={ this.state.host } onChange={ (e, input) => { this.handleHostChange([input.value]);  } } />
        </Form>
      );

      return (
        <Popup
          trigger={ editHost }
        >
          Press enter to connect
        </Popup>
      );
    }

    if (this.props.status === 'connecting') {
      return (
        <Loader active indeterminate inline size='tiny' />
      );
    }

    const connected = (
      <div>
        <Label circular color='green' empty style={ {marginRight: '10px'} }/>
        { this.props.host }
      </div>
    );

    return (
      <Popup
        trigger={ connected }
        flowing
        hoverable
      >
        <p>Connected to <code>{ this.props.host }</code></p>
        <p><Button content='Disconnect' negative size='tiny' /></p>
      </Popup>
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
    connect: React.PropTypes.func.isRequired
  }).isRequired
};

export default Server;
