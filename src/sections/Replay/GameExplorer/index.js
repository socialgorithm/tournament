import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Header, Grid, List, Label, Table, Divider, Message } from 'semantic-ui-react';
import UTTT from '@socialgorithm/ultimate-ttt';
import { ME, OPPONENT } from '@socialgorithm/ultimate-ttt/dist/model/constants';

import UTTTGame from '../../../components/UTTTGame';

const PLAYER_YOU = ME;
const PLAYER_OPPONENT = OPPONENT;

class GameExplorer extends React.Component {
  constructor(props) {
    super(props);

    const {error, games, won, lost, tied} = this.parseGameData(props.gameData);

    console.log('parsed', games);

    this.state = {
      error,
      games,
      activeGame: 0,
      activeMove: -1,
      won,
      lost,
      tied,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.gameData !== nextProps.gameData) {
      const {games, won, lost, tied} = this.parseGameData(nextProps.gameData);

      this.setState({
        games,
        activeGame: 0,
        activeMove: -1,
        won,
        lost,
        tied,
      });
    }
  }

  parseGameData = (gameData) => {
    const ret = {
      error: null,
      games: [],
      won: 0,
      lost: 0,
      tied: 0,
    };
    const newline = /\r\n|\r|\n/g;
    const lines = gameData.split(newline)
      .filter((line) => line.length > 0)
      .map((line) => line.split('] ').pop()
      );
    let curGame;
    try {
      lines.forEach((line) => {
        if (line === 'init') {
          if (ret.games[curGame]) {
            console.log('Was it finished? ', ret.games[curGame].uttt.isFinished());
          }
          curGame = ret.games.push({
            uttt: new UTTT(3),
            moves: [],
          }) - 1;
          return;
        }
        if (line.indexOf(';') < 0) {
          return;
        }
        const game = ret.games[curGame];
        const parts = line.split(' ');
        let turn = parts[0].split(';');
          let opponent = false;
          if (parts.length > 1) {
            opponent = true;
            turn = parts[1].split(';');
          }
          const board = turn[0].split(',').map((coord) => parseInt(coord, 10));
          const move = turn[1].split(',').map((coord) => parseInt(coord, 10));

          game.moves.push({
            board,
            move,
            player: (opponent) ? PLAYER_OPPONENT : PLAYER_YOU,
          });

          if (opponent) {
            game.uttt = game.uttt.addOpponentMove(board, move);
          } else {
            game.uttt = game.uttt.addMyMove(board, move);
          }

          // update state
          if (game.uttt.isFinished()) {
            switch (game.uttt.getResult()) {
              case PLAYER_YOU:
                ret.won = ret.won + 1;
                break;
              case PLAYER_OPPONENT:
                ret.lost = ret.lost + 1;
                break;
              default:
              case -1:
                ret.tied = ret.tied + 1;
                break;
            }
          }
      });
    } catch(e) {
      console.error('Error parsing game', e);
      ret.error = 'Unable to parse game - please make sure the log file is correct.';
      return ret;
    }
    return ret;
  };

  printWinner = (winner) => {
    let color = 'grey';
    let text = 'Tied';
    if (winner === PLAYER_YOU) {
      color = 'green';
      text = 'won';
    } else if (winner === PLAYER_OPPONENT) {
      color = 'red';
      text = 'lost'
    }
    return (
      <Label color={ color }>
        { text }
      </Label>
    );
  };

  select = (move) => {
    if (this.state.activeMove === move) {
      this.setState({
        activeMove: -1,
      });
    } else {
      this.setState({
        activeMove: move,
      });
    }
  };

  render() {
    let activeMove = {
      board: null,
      move: null,
    };
    if (this.state.activeMove > -1) {
      activeMove = this.state.games[this.state.activeGame].moves[this.state.activeMove];
    }

    if (this.state.error) {
      return (
        <Message error>
          { this.state.error }
        </Message>
      );
    }

    return (
      <Grid>
        <Grid.Column width={ 4 }>
          <h2>
            <div style={ { float: 'right' } }>
              <Label color='green'>
                <b>Won:</b> { this.state.won }
              </Label>
              <Label color='red'>
                <b>Lost:</b> { this.state.lost }
              </Label>
              <Label color='grey'>
                <b>Tied:</b> { this.state.tied }
              </Label>
            </div>
            Games
          </h2>
          <List selection divided relaxed>
            { this.state.games.map((game, $index) => (
              <List.Item key={ $index } active={ $index === this.state.activeGame } onClick={ () => { this.setState({ activeGame: $index, activeMove: -1, }); } }>
                <List.Content>
                  { this.printWinner(game.uttt.winner) } { game.uttt.moves } moves
                </List.Content>
              </List.Item>
            )) }
          </List>
        </Grid.Column>
        <Grid.Column width={ 12 }>
          <Grid columns={ 2 } stackable>
            <Grid.Column>
              <Header>Game</Header>
              <UTTTGame
                style={ { fontSize: '0.7em', margin: '0 auto' } }
                game={ this.state.games[this.state.activeGame].uttt }
                highlightBoard={ activeMove.board }
                highlightMove={ activeMove.move }
              />
              <Divider />
              <p><Label empty circular color='blue' horizontal /> Player A (You)</p>
              <p><Label empty circular color='red' horizontal /> Player B (Opponent)</p>
            </Grid.Column>
            <Grid.Column>
              <Header>Moves</Header>
              <Table selectable inverted striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Board</Table.HeaderCell>
                    <Table.HeaderCell>Move</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { this.state.games[this.state.activeGame].moves.map((data, $index) => (
                    <Table.Row
                      className={ classNames({ active: this.state.activeMove === $index}) }
                      key={ $index }
                      onClick={ () => { this.select($index) } }
                    >
                      <Table.Cell>
                        <Label circular color={ (data.player === 0)? 'blue' : 'red' }>{ $index + 1 }</Label>
                      </Table.Cell>
                      <Table.Cell>{ data.board.join(', ') }</Table.Cell>
                      <Table.Cell>{ data.move.join(', ') }</Table.Cell>
                    </Table.Row>
                  )) }
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    );
  }
}

GameExplorer.propTypes = {
  gameData: PropTypes.string.isRequired,
};

export default GameExplorer;
