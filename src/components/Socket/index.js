import React from 'react';
import io from 'socket.io-client';


class Socket extends React.Component {
  constructor(props) {
    super(props);

    this.socket = null;
  }

  componentDidMount() {
    if (this.props.status === 'connecting') {
      this.connect();
    }
  }

  componentWillUnmount() {
    console.log('destroy socket');
  }

  connect = () => {
    console.log('Connecting socket');
    this.socket = io.connect(this.props.host, {
      query: {
        client: true,
      }
    });

    this.props.actions.connected();

    this.socket.on('error', function (data) {
      console.error('Error in socket', data);
    });
  };

  render (){ return null; }
}


Socket.propTypes = {
  host: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
  error: React.PropTypes.string,
  actions: React.PropTypes.shape({
    connected: React.PropTypes.func.isRequired
  }).isRequired
};

export default Socket;
