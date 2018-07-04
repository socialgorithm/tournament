import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import SocketContext from './provider';
class SocketProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      emit: this.emit,
    };

    if (localStorage.getItem('host') !== null) {
      this.props.actions.connect(
        localStorage.getItem('host')
      );
    }
  }

  componentDidUpdate() {
    if (this.props.status === 'connecting') {
      this.connect();
    }
    if (this.props.status === 'disconnecting') {
      this.disconnect();
    }
  }

  componentWillUnmount() {
    this.disconnect();
  }

  emit = (message, payload) => {
    if (!this.state.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.state.socket.emit(message, payload);
  };

  disconnect = () => {
    if (this.state.socket) {
      this.state.socket.close();
      this.props.actions.disconnected();
    }
  };

  connect = () => {
    const socket = io(this.props.host, {
      reconnection: false,
      query: {
        client: true,
      }
    });

    socket.on('stats', (data) => {
      this.props.actions.updateStats(data);
    });

    socket.on('tournament', (data) => {
      this.props.actions.updateTournaments(data);
    });

    socket.on('connect', () => {
      this.props.actions.connected();
      // persist the host to localStorage
      localStorage.setItem('host', this.props.host);
    });

    socket.on('disconnect', (data) => {
      this.props.actions.disconnected(data);
    });

    socket.on('reconnect_error', (data) => {
      this.props.actions.error({
        type: 'reconnect_error',
        message: data.message,
      });
    });

    socket.on('connect_error', (data) => {
      this.props.actions.error({
        type: 'connect_error',
        message: data.message,
      });
    });

    socket.on('error', (data) => {
      const message = (typeof data === 'string') ? data : data.message;
      this.props.actions.error({
        type: 'error',
        message,
      });
    });

    socket.connect();

    this.setState({
      socket,
    });
  };

  render() {
    return (
      <SocketContext.Provider value={ this.state }>
        { this.props.children }
      </SocketContext.Provider>
    );
  }
}

SocketProvider.propTypes = {
  host: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    connected: PropTypes.func.isRequired,
    disconnected: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
    updateStats: PropTypes.func.isRequired,
    updateTournaments: PropTypes.func.isRequired,
  }).isRequired,
};

export default SocketProvider;

export {
  SocketContext,
};