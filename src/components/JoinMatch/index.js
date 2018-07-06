import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Container, Message, Loader, Button, Segment, Header, Grid, List, Label } from 'semantic-ui-react';

class JoinMatch extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            admin: false,
            players: 1,
        };
    }
    componentDidMount() {
        this.props.socket.socket.on('lobby joined', data => {
            this.setState({
                admin: data.isAdmin,
            });
        });
        this.props.socket.emit('lobby join', {
            token: this.token(),
        });
    }

    // componentWillUnmount() {
    //     // leave the lobby?
    //     this.props.socket.emit();
    // }

    token = () => this.props.match.params.name;

    renderLoader = () => {
        if (this.state.admin) {
            return null;
        }
        return (
            <p>
                <Loader
                    inline
                    active
                    content='Waiting for game to start...'
                />
            </p>
        );
    };

    renderAdmin = () => {
        if (!this.state.admin) {
            return null;
        }
        return (
            <div>
                <Header content='Admin' />
                <p>You are the admin for this lobby</p>
                <Button
                    primary
                    content='Start Game'
                />
            </div>
        );
    };

    renderPlayers = () => {
        const footerStyle = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: '0.3em',
            width: '100%',
            textAlign: 'center',
            background: '#efefef',
            fontSize: '0.7em',
        };
        return (
            <div>
                <p>Connected Players <Label size='mini' style={ { float: 'right' } }>{ this.state.players }</Label></p>
                <List></List>
                <div style={ footerStyle }><Icon name='copy outline' /> { this.token() }</div>
            </div>
        );
    };

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
                <Segment textAlign='left'>
                    <Grid columns={ 2 } divided>
                        <Grid.Column width={ 4 }>
                            { this.renderPlayers() }                        
                        </Grid.Column>
                        <Grid.Column>
                            { this.renderLoader() }
                            { this.renderAdmin() }
                        </Grid.Column>
                    </Grid>
                </Segment>                
            </Container>
        );
    }
};

export default withRouter(JoinMatch);