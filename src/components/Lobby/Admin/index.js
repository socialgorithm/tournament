import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Icon,
	Container,
	Message,
	Loader,
	Button,
	Segment,
	Grid,
	List,
	Label,
	Form,
	Dropdown, Popup
} from 'semantic-ui-react';
import classNames from 'classnames';

import Tournament from '../Tournament'

class LobbyAdmin extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            admin: false,
            availableGames: [],
            lobby: {
                token: null,
                players: [],
                tournament: null,
            },
            tournamentOptions: {
                gameAddress: null,
                timeout: 100,
                numberOfGames: 50,
                type: 'DoubleElimination',
	            autoPlay: false
            },
            update: 0, // since we are not using immutable data structures (yet), bump this when making a deep change
            activePlayers: [],
            activePlayersDrop: false,
            connectedPlayersDrop: false,
            showTournament: true,
            joinCommandCopyIcon: 'copy',
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
            console.log('connected', lobby);
            this.setState({
                lobby, activePlayers
            });
        });
        this.props.socket.socket.on('lobby disconnected', data => {
            const lobby = data.payload.lobby;
            if (lobby.token !== this.state.lobby.token) {
                return;
            }
            console.log('lobby disconnected', lobby);
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
            this.setState({
                admin: isAdmin,
                lobby,
                showTournament: true,
            });
        });
        
        this.props.socket.socket.on("GameList", data => {
            this.setState({availableGames: data}, () => {
                //Select first available game if nothing selected
                if(this.state.tournamentOptions.gameAddress === null && this.state.availableGames.length > 0) {
                    const firstGame = this.state.availableGames[0];
                    if(firstGame.healthy) {
                        this.setState({tournamentOptions: {
                            ...this.state.tournamentOptions,
                            gameAddress: firstGame.address
                        }});
                    }
                }
            });
        });

	    this.props.socket.socket.on('lobby tournament started', data => {
            if (!data.tournament) {
			    return;
		    }

            let newLobby = Object.assign({}, this.state.lobby);
            newLobby.tournament = data.tournament;
            console.log('lobby tournament started', newLobby);
            this.setState({lobby: newLobby});
        });
        
        this.props.socket.socket.on('lobby tournament continued', data => {
            if (!data.tournament) {
			    return;
		    }

            let newLobby = Object.assign({}, this.state.lobby);
            newLobby.tournament = data.tournament;
            console.log('lobby tournament continued', newLobby);
            this.setState({lobby: newLobby});
        });
        
        this.props.socket.socket.on('lobby player disconnected', data => {
            if (!data.lobby) {
                return;
            }
            console.log('lobby player disconnected', data.lobby);
            this.setState({
                lobby: data.lobby,
            });
            this.ensureActivePlayersConnected();
        });

	    this.props.socket.socket.on('lobby player kicked', data => {
		    if (!data.lobby) {
			    return;
            }
            console.log('lobby player kicked', data.lobby);
		    this.setState({
			    lobby: data.lobby,
            });
            this.ensureActivePlayersConnected();
	    });
	    this.props.socket.socket.on('lobby player banned', data => {
		    if (!data.lobby) {
			    return;
            }
            console.log('lobby player banned', data.lobby);
		    this.setState({
			    lobby: data.lobby,
            });
            this.ensureActivePlayersConnected();
	    });
        this.props.socket.socket.on('tournament stats', data => {
            const lobby = this.state.lobby;
            if (lobby.tournament && data) {
                lobby.tournament = data;
                console.log('tournament stats', lobby);
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
        this.removeActivePlayer(token);
	};

	banPlayer = (token) => {
		this.props.socket.socket.emit('lobby player ban', {
			lobbyToken: this.state.lobby.token,
			playerToken: token
        });
        this.removeActivePlayer(token);
    };

    ensureActivePlayersConnected = () => {
        const activePlayers = [...this.state.activePlayers];
        this.setState({
            activePlayers: activePlayers.filter(activePlayer => this.state.lobby.players.indexOf(activePlayer) !== -1 ),
        });

    }

    addActivePlayer = (token) => {
        const activePlayers = [...this.state.activePlayers];
        if (!activePlayers.find(player => player === token)) {
            const player = this.state.lobby.players.find(player => player === token);
            if (player) {
                activePlayers.push(player);
                this.setState({
                    activePlayers,
                });
            }
        }
    }
    
    removeActivePlayer = (token) => {
        const index = this.state.activePlayers.indexOf(token);
        if (index > -1) {
            const activePlayers = [...this.state.activePlayers];
            activePlayers.splice(index, 1);
            this.setState({
                activePlayers,
            });
        }
    };

	onDragPlayerStart = (token, e) => {
		e.dataTransfer.setData("text/plain", token);
		e.dataTransfer.effectAllowed = 'move';
	};

	onDragPlayerDrop = (e, type) => {
		e.preventDefault();
		const token = e.dataTransfer.getData("text");
		if (type === 'active') {
			this.addActivePlayer(token);
		} else {
            this.removeActivePlayer(token);
        }
                                                                        		this.setState({
            activePlayersDrop: false,
            connectedPlayersDrop: false,
        });
	};

	onDragPlayerMouseMove = (e, type, playersDrop) => {
		e.preventDefault();
		const key = type + 'PlayersDrop';
		this.setState({
            [key]: playersDrop,
        });
	};

	onDragPlayerOver = (e, type) => {
		e.preventDefault();
	};

	backToLobby = () => {
		this.setState({showTournament: false});
	};

	continueMatches = () => {
		this.props.socket.socket.emit('lobby tournament continue', {
			token: this.state.lobby.token
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
        const availableGames = this.state.availableGames.map(game => {
            return {
                text: `${!game.healthy ? '[UNHEALTHY] ' : '' }${game.info.name}`,
                value: game.address,
                title: `${game.address}`,
                icon: game.healthy ? 'green circle' : 'yellow warning sign',
                disabled: !game.healthy,
            }
        });
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
        const title = (this.state.lobby.players.length < 2 || this.invalidGameServerSelected()) ? 'Atleast two players + healthy game server connection required' : 'Start the match';
	    return (
            <Grid columns={ 1 }>
                <Grid.Row>
                    <Grid.Column>
                        <h3>Tournament Settings:</h3>
                        <Form size='small'>
                            <Form.Select
                                label='Game'
                                options={ availableGames }
                                className={ this.invalidGameServerSelected() ? 'error' : '' }
                                value={ this.state.tournamentOptions.gameAddress }
                                onChange={ this.updateOption('gameAddress') }
                            />
                            <Form.Group widths='equal'>
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
                            </Form.Group>
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
                            <Button
                                primary
                                icon='play'
                                title={ title }
                                disabled={ this.state.activePlayers.length < 2 || this.invalidGameServerSelected() }
                                content='Start Game'
                                onClick={ this.startTournament }
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
        const joinCommandStyle= {
            marginLeft: '5px',
        }
        const host = this.props.socket.socket.io.uri;
        return (
            <div style={ connectStyle }>
                <p>Connect your player:</p>
                <pre className='code'>
                    <Button
                    size='mini'
                    icon= { this.state.joinCommandCopyIcon }
                    title='Click to copy'
                    onClick={ this.copyJoinCommandToClipboard }
                    />
                    <span id='joincommand' style={ joinCommandStyle }>
                       uabc --host "{host}" --lobby "{this.token()}" --token "your team name" -f "path/to/executable" 
                    </span>
                </pre>
            </div>
        );
    };

    copyJoinCommandToClipboard = () => {
        const textToCopy = document.getElementById('joincommand').textContent;
        const textArea = document.createElement('textarea');
        textArea.textContent = textToCopy;
        document.body.append(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); /*For mobile devices*/
        document.execCommand("copy");
        this.setState({joinCommandCopyIcon: 'check'});
        setTimeout(() => { this.setState({joinCommandCopyIcon: 'copy'} ) }, 2000);
    };

    addAllConnectedPlayers = () => {
        this.setState({
            activePlayers: this.state.lobby.players,
        });
    };

    invalidGameServerSelected = () => {
        const currentGameAddress = this.state.tournamentOptions.gameAddress.tournamentServerAccessibleAddress
        const currentGame = this.state.availableGames.find(game => game.address.tournamentServerAccessibleAddress === currentGameAddress )
        return currentGameAddress === undefined || currentGameAddress === null || currentGameAddress.length === 0 
            || currentGame === undefined || currentGame.healthy === false;
    };

	renderPlayers = ({titleText, type, dropText, infoText, displayAddAll}) => {
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
        players.sort();
        const playerDropKey = type + 'PlayersDrop';
        
        let addAll = (
            <div style={ footerStyle }>
                <a href={ window.location }><Icon name='copy outline' /> { this.token() }</a>
            </div>
        );
        if (displayAddAll) {
            addAll = (
                <div style={ footerStyle }>
					<button className="link" onClick={ this.addAllConnectedPlayers }>
                        <Icon name='plus' /> Add All
                    </button>
				</div>
            );
        }

		return (
			<div style={ { paddingBottom: '2em', height: 'calc(100% - 2em)' } }>
				<Popup trigger={<p>{titleText} <Label size='mini' style={ { float: 'right' } }>{ players.length }</Label></p>} content={infoText} />

				<div onDrop={(e) => this.onDragPlayerDrop(e, type)} onDragOver={this.onDragPlayerOver} onDragEnter={(e) => this.onDragPlayerMouseMove(e, type, true)} onDragLeave={(e) => this.onDragPlayerMouseMove(e, type, false)}
				     style={{height: '100%', position: 'relative', background: this.state[playerDropKey] && '#efefef', borderRadius: this.state[playerDropKey] && '0.28571429rem'}}>
					{
						!this.state[playerDropKey] &&
						<List className='draggable relaxed divided'>
							{ players.map(player => {
                                const isActive = this.state.activePlayers.indexOf(player) > -1;
                                return (
                                    <List.Item key={ player } draggable className={ classNames({ inactive: !isActive }) } onDragStart={(e) => this.onDragPlayerStart(player, e)}>
                                        <Icon name='circle' className={ classNames({ outline: !isActive }) } color='green' style={{display: 'inline-block', marginRight: '1rem'}}/>
                                        { player }
                                        <Dropdown style={{float: 'right'}}>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text="Kick player" onClick={() => this.kickPlayer(player)}/>
                                                <Dropdown.Item text="Ban player" onClick={() => this.banPlayer(player)}/>
                                                { !isActive && (<Dropdown.Item text="Add player" onClick={() => this.addActivePlayer(player)}/>) }
                                                { isActive && (<Dropdown.Item text="Remove player" onClick={() => this.removeActivePlayer(player)}/>) }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </List.Item>
                                );
                            }) }
						</List>
					}
					{
						this.state[playerDropKey] &&
						<p style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', textAlign: 'center'}}>{dropText}</p>
					}
				</div>
				{ addAll }
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
                <Tournament
                  tournamentOptions={ this.state.tournamentOptions }
                  tournament={ this.state.lobby.tournament }
                  backToLobby={this.backToLobby}
                  continueMatches={this.continueMatches}
                />
            );
        }
    
        return (
            <Container textAlign='center' fluid style={{width: '80%'}}>
                <Segment attached='top' className='socialgorithm-hue-bg animated-hue'>
                    <h1><Icon name='game' /> Welcome to { this.state.lobby.token }!</h1>
                </Segment>
                <Segment attached='bottom' textAlign='left'>
                    <Grid columns={ 3 } divided>
	                    <Grid.Column width={ 3 }>
		                    { this.renderPlayers({titleText: 'Connected Players', type: 'connected', dropText: 'Exclude player from game', infoText: 'Players connected to the lobby', displayAddAll: true}) }
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

export default withRouter(LobbyAdmin);