import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Container, Message, Loader } from 'semantic-ui-react';

class JoinMatch extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            players: 1,
        };
    }
    componentDidMount() {
        this.props.socket.emit('lobby join', {
            token: this.token(),
        });
    }

    // componentWillUnmount() {
    //     // leave the lobby?
    //     this.props.socket.emit();
    // }

    token = () => this.props.match.params.name;

    render() {
        if (!this.props.socket) {
            return (
                <Message>
                    Please connect to the server first.
                </Message>
            );
        }
    
        return (
            <Container textAlign='center'>
                <h1><Icon name='game' /><br /> Joined Match!</h1>
                <p>
                    <Loader
                        inline
                        active
                        content='Waiting for game to start...'
                    />
                </p>
                <Message compact>
                    Available Players: { this.state.players }
                </Message>
            </Container>
        );
    }
};

export default withRouter(JoinMatch);