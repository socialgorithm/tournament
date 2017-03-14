import React from 'react';
import io from 'socket.io-client';


class Socket extends React.Component {
  constructor(props) {
    super(props);

    this.socket = null;
  }

  componentDidUpdate() {
    console.log('socket update', this.props.status);
    if (this.props.status === 'connecting') {
      this.connect();
    }
  }

  componentWillUnmount() {
    console.log('destroy socket');
  }

  connect = () => {
    console.log('Connecting socket');

    this.socket = io(this.props.host, {
      reconnection: false,
      reconnectionAttempts: 0,
    });

    this.socket.on('connect', (data) => {
      console.log('connected', data);
      this.props.actions.connected();
    });

    this.socket.on('disconnect', (data) => {
      console.log('Disconnected', data);
      this.props.actions.disconnected(data);
    });

    this.socket.on('reconnect_error', (data) => {
      this.props.actions.error({
        type: 'reconnect_error',
        message: data.message,
      });
    });

    this.socket.on('connect_error', (data) => {
      this.props.actions.error({
        type: 'connect_error',
        message: data.message,
      });
    });

    this.socket.on('error', (data) => {
      this.props.actions.error({
        type: 'error',
        message: data.message,
      });

    });

    this.socket.connect({
      query: {
        client: true,
      }
    });
  };

  render (){ return null; }
}


Socket.propTypes = {
  host: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
  actions: React.PropTypes.shape({
    connected: React.PropTypes.func.isRequired,
    disconnected: React.PropTypes.func.isRequired,
    error: React.PropTypes.func.isRequired,
  }).isRequired
};

export default Socket;
