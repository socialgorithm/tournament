import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { connect, disconnect } from './socket';

import SocketContext from './provider';

class SocketProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      emit: this.emit,
      uuid: props.uuid,
    };

    if (localStorage.getItem('host') !== null) {
      this.props.actions.connect(
        localStorage.getItem('host')
      );
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.status === 'connecting') {
      return connect(props, state);
    }
    if (props.status === 'disconnecting') {
      return disconnect(props, state);
    }
    return state;
  }

  componentWillUnmount() {
    this.disconnect();
  }

  emit = (message, payload) => {
    if (!this.state.socket) {
      console.warn('Socket not connected');
      return;
    }
    return this.state.socket.emit(message, payload);
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

export default withRouter(SocketProvider);