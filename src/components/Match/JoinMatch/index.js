import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Container, Message, Loader, Button, Segment, Header, Grid, List, Label, Form } from 'semantic-ui-react';

import MatchPage from '../MatchPage';

class JoinMatch extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            admin: false,
            lobby: {
                token: null,
                players: [],
                tournament: null,
            },
            tournamentOptions: {
                timeout: 100,
                numberOfGames: 10,
                type: 'FreeForAll',
            },
            update: 0, // since we are not using immutable data structures (yet), bump this when making a deep change
        };
    }

    componentDidMount() {
        this.props.socket.socket.on('connected', data => {
            const lobby = data.lobby;
            if (lobby.token !== this.state.lobby.token) {
                return;
            }
            this.setState({
                lobby: lobby,
            });
        });
        this.props.socket.socket.on('lobby disconnected', data => {
            const lobby = data.payload.lobby;
            if (lobby.token !== this.state.lobby.token) {
                return;
            }
            this.setState({
                lobby,
            });
        });
        this.props.socket.emit('lobby join', {
            token: this.token(),
            spectating: true,
        });
        this.props.socket.socket.on('lobby joined', data => {
            this.setState({
                admin: data.isAdmin,
                lobby: data.lobby,
            });
        });
        this.props.socket.socket.on('lobby tournament started', data => {
            if (!data.lobby || !data.lobby.tournament) {
                return;
            }
            this.setState({
                lobby: data.lobby,
            });
        });
        this.props.socket.socket.on('tournament stats', data => {
            const lobby = this.state.lobby;
            if (lobby.tournament && data) {
                lobby.tournament = data;
                this.setState({
                    lobby,
                    update: this.state.update + 1,
                });
            } else {
                console.warn('Tournament is null', this.state.lobby);
            }
        });
    }

    startTournament = () => {
        this.props.socket.socket.emit('lobby tournament start', {
            token: this.state.lobby.token,
            options: this.state.tournamentOptions,
        });
    };

    token = () => this.props.match.params.name;

    updateOption = (field) => (event, data) => {
        const updatedOptions = this.state.tournamentOptions;
        updatedOptions[field] = data.value;
        this.setState({
            tournamentOptions: updatedOptions,
            update: this.state.update + 1,
        });
    };

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
        const tournamentModes = [
            {
                text: 'Free For All',
                value: 'FreeForAll',
                title: 'Everyone plays everyone else',
            },
        ];
        const title = (this.state.lobby.players.length < 2) ? 'At least two players need to be connected' : 'Start the match';
        return (
            <Grid columns={ 2 }>
                <Grid.Row>
                    <Grid.Column>
                        <Header content='Admin' />
                        <p>You are the admin for this lobby</p>
                        <Button
                            primary
                            icon='play'
                            title={ title }
                            disabled={ this.state.lobby.players.length < 2 }
                            content='Start Game'
                            onClick={ this.startTournament }
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h3>Tournament Settings:</h3>
                        <Form size='small'>
                            <Form.Input
                                label='Timeout (Per Move, in ms)'
                                type='number'
                                placeholder='100'
                                value={ this.state.tournamentOptions.timeout }
                                onChange={ this.updateOption('timeout') }
                            />
                            <Form.Input
                                label='Number of Games per Match'
                                type='number'
                                placeholder='10'
                                value={ this.state.tournamentOptions.numberOfGames }
                                onChange={ this.updateOption('numberOfGames') }
                            />
                            <Form.Select
                                label='Tournament Type'
                                options={ tournamentModes }
                                value={ this.state.tournamentOptions.type }
                                onChange={ this.updateOption('type') }
                            />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
                <pre className='code'>$ uabc --host "{host}" --lobby "{this.token()}" --token "your team name" -f "path/to/executable"</pre>
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
        const players = this.state.lobby.players;
        return (
            <div style={ { paddingBottom: '2em' } }>
                <p>Connected Players <Label size='mini' style={ { float: 'right' } }>{ players.length }</Label></p>
                <List>
                    { players.map(player => (
                        <List.Item key={ player.token }>
                            <Icon name='circle' color='green' /> { player.token }
                        </List.Item>
                    )) }
                </List>
                <div style={ footerStyle }>
                    <a href={ window.location }><Icon name='copy outline' /> { this.token() }</a>
                </div>
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

        if (this.state.lobby.tournament) {
            return (
                <MatchPage
                  tournament={ this.state.lobby.tournament }
                />
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