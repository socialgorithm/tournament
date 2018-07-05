import io from 'socket.io-client';

export const connect = (props, state) => {
    if (state.socket) {
        console.log('already connected!');
        return state;
    }
    const socket = io(props.host, {
        reconnection: false,
        query: {
            client: true,
        }
    });

    socket.on('stats', (data) => {
        props.actions.updateStats(data);
    });

    socket.on('tournament', (data) => {
        props.actions.updateTournaments(data);
    });

    socket.on('connect', () => {
        props.actions.connected();
        // persist the host to localStorage
        localStorage.setItem('host', props.host);
    });

    socket.on('disconnect', (data) => {
        props.actions.disconnected(data);
    });

    socket.on('reconnect_error', (data) => {
        props.actions.error({
            type: 'reconnect_error',
            message: data.message,
        });
    });

    socket.on('connect_error', (data) => {
        props.actions.error({
            type: 'connect_error',
            message: data.message,
        });
    });

    socket.on('error', (data) => {
        const message = (typeof data === 'string') ? data : data.message;
            props.actions.error({
            type: 'error',
            message,
        });
    });

    socket.connect();

    return {
        socket,
    };
};

export const disconnect = (props, state) => {
    if (state.socket) {
      state.socket.close();
      props.actions.disconnected();
    }
    return {
      socket: null,
    };
  };