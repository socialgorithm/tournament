import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Container, Message, Loader, Button, Segment, Header, Grid, List, Label } from 'semantic-ui-react';

class JoinMatch extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            admin: false,
            players: [],
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
            <div style={ { textAlign: 'center', color: '#999' } }>
                <Loader
                    inline
                    active
                    content='Waiting for game to start...'
                />
            </div>
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

    renderJoinCommand = () => {
        const connectStyle = {
            margin: '1em -1em 0',
            borderTop: '1px solid #efefef',
            padding: '1em 1em 0',
            fontSize: '0.9em',
        };
        const host = this.props.socket.socket.io.uri;
        return (
            <div style={ connectStyle }>
                <p>Connect your player:</p>
                <pre className='code'>$ uabc --host "{host}" --token "{this.token()}" -f "path/to/executable"</pre>
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
            <div style={ { paddingBottom: '2em' } }>
                <p>Connected Players <Label size='mini' style={ { float: 'right' } }>{ this.state.players.length }</Label></p>
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
                        <Grid.Column width={ 12 }>
                            { this.renderLoader() }
                            { this.renderAdmin() }
                            { this.renderJoinCommand() }
                        </Grid.Column>
                    </Grid>
                </Segment>                
            </Container>
        );
    }
};

export default withRouter(JoinMatch);