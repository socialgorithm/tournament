import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Header, Grid, List, Label, Table, Divider } from 'semantic-ui-react';
import UTTT from 'ultimate-ttt';

import UTTTGame from '../../../components/UTTTGame';

class GameExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      games: this.parseGameData(props.gameData),
      activeGame: 0,
      activeMove: -1,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      games: this.parseGameData(nextProps.gameData),
    });
  }

  parseGameData = (gameData) => {
    const lines = gameData.split("\n")
      .filter((line) => line.length > 0)
      .map((line) => line.split('] ').pop()
      );
    const games = [];
    let curGame;
    lines.forEach((line) => {
      if (line === 'init') {
        curGame = games.push({
          uttt: new UTTT(3),
          moves: [],
        }) - 1;
        return;
      }
      if (line.indexOf(';') < 0) {
        return;
      }
      const game = games[curGame];
      const parts = line.split(' ');
      let turn = parts[0].split(';');
      try {
        let opponent = false;
        if (parts.length > 1) {
          opponent = true;
          turn = parts[1].split(';');
        }
        const board = turn[0].split(',');
        const move = turn[1].split(',');

        game.moves.push({
          board,
          move,
          player: (opponent) ? 1 : 0,
        });

        if (opponent) {
          game.uttt = game.uttt.addOpponentMove(board, move);
        } else {
          game.uttt = game.uttt.addMyMove(board, move);
        }
      } catch(e) {
        console.log('Error', e);
        //throw e;
      }
    });
    console.log(games);
    return games;
  };

  printWinner = (winner) => {
    let color = 'grey';
    let text = 'Tied';
    if (winner === 0) {
      color = 'green';
      text = 'won';
    } else if (winner === 1) {
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

    return (
      <Grid>
        <Grid.Column width={ 4 }>
          <Header>Games</Header>
          <List selection divided relaxed>
            { this.state.games.map((game, $index) => (
              <List.Item key={ $index } active={ $index === this.state.activeGame } onClick={ () => { this.setState({ activeGame: $index }); } }>
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
                style={ { fontSize: '0.7em' } }
                game={ this.state.games[this.state.activeGame].uttt }
                highlightBoard={ activeMove.board }
                highlightMove={ activeMove.move }
              />
              <Divider />
              <p><Label empty circular color='blue' horizontal /> You</p>
              <p><Label empty circular color='red' horizontal /> Opponent</p>
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
