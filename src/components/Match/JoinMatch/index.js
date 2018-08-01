import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Icon,
	Container,
	Message,
	Loader,
	Button,
	Segment,
	Header,
	Grid,
	List,
	Label,
	Form,
	Dropdown, Popup
} from 'semantic-ui-react';

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
	            autoPlay: true
            },
            update: 0, // since we are not using immutable data structures (yet), bump this when making a deep change
            activePlayers: [],
	        activePlayersDrop: false
        };
    }

    componentDidMount() {
        this.props.socket.socket.on('connected', data => {
            const lobby = data.lobby;
            if (lobby.token !== this.state.lobby.token) {
                return;
            }
	        let activePlayers = this.state.activePlayers;
	        if (this.state.lobby.players.length === this.state.activePlayers.length) {
		        activePlayers = lobby.players.slice();
	        }
            this.setState({
                lobby, activePlayers
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
            const {lobby, isAdmin} = data;
            const tournamentActive = lobby.tournament ? !lobby.tournament.finished : false;
            this.setState({
                admin: isAdmin,
                lobby,
	            showTournament: tournamentActive
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
	    this.props.socket.socket.on('lobby player kicked', data => {
		    if (!data.lobby) {
			    return;
		    }
		    this.setState({
			    lobby: data.lobby,
		    });
	    });
	    this.props.socket.socket.on('lobby player banned', data => {
		    if (!data.lobby) {
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
            }
        });
    }

    startTournament = () => {
        this.props.socket.socket.emit('lobby tournament start', {
            token: this.state.lobby.token,
            options: this.state.tournamentOptions,
	        players: this.state.activePlayers.map(p => p.token)
        });
	    this.setState({showTournament: true});
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

	updateTypeOption = (event, data) => {
		const updatedOptions = this.state.tournamentOptions;
		updatedOptions.type = data.value;
		updatedOptions.autoPlay = data.value === 'FreeForAll';
		this.setState({
			tournamentOptions: updatedOptions,
			update: this.state.update + 1,
		});
	};

	updateCheckedOption = (field) => (event, data) => {
		const updatedOptions = this.state.tournamentOptions;
		updatedOptions[field] = data.checked;
		this.setState({
			tournamentOptions: updatedOptions,
			update: this.state.update + 1,
		});
	};

	kickPlayer = (token) => {
		this.props.socket.socket.emit('lobby player kick', {
			lobbyToken: this.state.lobby.token,
			playerToken: token
		});
	};

	banPlayer = (token) => {
		this.props.socket.socket.emit('lobby player ban', {
			lobbyToken: this.state.lobby.token,
			playerToken: token
		});
	};

	onDragPlayerStart = (token, e) => {
		e.dataTransfer.setData("text/plain", token);
		e.dataTransfer.effectAllowed = 'move';
	};

	onDragPlayerDrop = (e, type) => {
		e.preventDefault();
		const token = e.dataTransfer.getData("text");
		let activePlayers = [...this.state.activePlayers];
		if (type === 'active') {
			if (!activePlayers.find(p => p.token === token)) {
				const player = this.state.lobby.players.find(p => p.token === token);
				activePlayers.push(player);
			}
		} else {
			const index = activePlayers.find(p => p.token === token);
			if (index !== -1) {
				activePlayers.splice(index, 1);
			}
		}

		const key = type + 'PlayersDrop';
		const update = {activePlayers};
		update[key] = false;
		this.setState(update);
	};

	onDragPlayerMouseMove = (e, type, playersDrop) => {
		e.preventDefault();
		const key = type + 'PlayersDrop';
		const update = {};
		update[key] = playersDrop;
		this.setState(update);
	};

	onDragPlayerOver = (e, type) => {
		e.preventDefault();
	};

	backToLobby = () => {
		this.setState({showTournament: false});
	};

	continueMatches = () => {
		this.props.socket.socket.emit('lobby tournament continue', {
			lobbyToken: this.state.lobby.token
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
            {
                text: 'Double Elimination',
                value: 'DoubleElimination',
                title: 'League Mode, a player gets kicked out when losing two games',
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
                            disabled={ this.state.activePlayers.length < 2}
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
                                onChange={ this.updateTypeOption }
                            />
	                        <Form.Checkbox
		                        label='Automatically play next set of games'
		                        checked={ this.state.tournamentOptions.autoPlay }
		                        onChange={ this.updateCheckedOption('autoPlay') }
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

	renderPlayers = ({titleText, type, dropText, infoText}) => {
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
		const players = type === 'connected' ? this.state.lobby.players : this.state.activePlayers;
		const playerDropKey = type + 'PlayersDrop';
		return (
			<div style={ { paddingBottom: '2em', height: 'calc(100% - 2em)' } }>
				<Popup trigger={<p>{titleText} <Label size='mini' style={ { float: 'right' } }>{ players.length }</Label></p>} content={infoText} />

				<div onDrop={(e) => this.onDragPlayerDrop(e, type)} onDragOver={this.onDragPlayerOver} onDragEnter={(e) => this.onDragPlayerMouseMove(e, type, true)} onDragLeave={(e) => this.onDragPlayerMouseMove(e, type, false)}
				     style={{height: '100%', position: 'relative', background: this.state[playerDropKey] && '#efefef', borderRadius: this.state[playerDropKey] && '0.28571429rem'}}>
					{
						!this.state[playerDropKey] &&
						<List>
							{ players.map(player => (
								<List.Item key={ player.token } draggable onDragStart={(e) => this.onDragPlayerStart(player.token, e)}>
									<Icon name='circle' color='green' style={{display: 'inline-block', marginRight: '1rem'}}/>
									{ player.token }
									<Dropdown style={{float: 'right'}}>
										<Dropdown.Menu>
											<Dropdown.Item text="Kick player" onClick={() => this.kickPlayer(player.token)}/>
											<Dropdown.Item text="Ban player" onClick={() => this.banPlayer(player.token)}/>
										</Dropdown.Menu>
									</Dropdown>
								</List.Item>
							)) }
						</List>
					}
					{
						this.state[playerDropKey] &&
						<p style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', textAlign: 'center'}}>{dropText}</p>
					}
				</div>
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

        if (this.state.lobby.tournament && this.state.showTournament) {
            return (
                <MatchPage
                  tournament={ this.state.lobby.tournament }
                  backToLobby={this.backToLobby}
                  continueMatches={this.continueMatches}
                />
            );
        }
    
        return (
            <Container textAlign='center' fluid style={{width: '80%'}}>
                <h1><Icon name='game' /><br /> Joined Match!</h1>
                <Segment textAlign='left'>
                    <Grid columns={ 3 } divided>
	                    <Grid.Column width={ 3 }>
		                    { this.renderPlayers({titleText: 'Connected Players', type: 'connected', dropText: 'Exclude player from game', infoText: 'Players connected to the lobby'}) }
	                    </Grid.Column>
	                    <Grid.Column width={ 3 }>
		                    { this.renderPlayers({titleText: 'Players', type: 'active', dropText: 'Include player in game', infoText: 'Players to be included in the tournament'}) }
	                    </Grid.Column>
                        <Grid.Column width={ 10 }>
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