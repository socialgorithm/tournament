import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Table, Loader, Container } from 'semantic-ui-react';

import './index.css';

class Tournaments extends React.Component {

  getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  getCell(playerA, playerB, key) {
    if (playerA === playerB || !this.props.players[playerA][playerB]) {
      return (
        <Table.Cell
          disabled
          style={ { background: '#efefef' } }
          key={ key }
        >
          -
        </Table.Cell>
      );
    }

    const session = this.props.players[playerA][playerB];
    if (!session.finished) {
      return (
        <Table.Cell key={ key }>
          <Loader active={ session.started && !session.finished } inline size='small'/>
        </Table.Cell>
      );
    }

    return (
      <Table.Cell key={ key } positive={ session.stats.winner === 0 } negative={ session.stats.winner === 1 }>
        W { session.stats.winPercentages[0] } - T { session.stats.tiePercentage }
      </Table.Cell>
    );
  }

  render() {
    const header = (this.props.started) ? 'Tournament' : 'Waiting for Tournament to start...';
    return (
      <Container>
        <h1>{ header }</h1>
        <Segment loading={ !this.props.started }>
          <Table definition celled striped textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                { Object.keys(this.props.players).map((player, $index) => (
                  <Table.HeaderCell key={ $index }>{ player }</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { Object.keys(this.props.players).map((playerA, $index) => (
                <Table.Row key={ $index }>
                  <Table.Cell key={ `head-cell-${$index}` }>{ playerA }</Table.Cell>
                  { Object.keys(this.props.players).map((playerB, $playerIndex) => this.getCell(playerA, playerB, `cell-${$playerIndex}`)) }
                </Table.Row>
              )) }
            </Table.Body>
          </Table>
        </Segment>
      </Container>
    );
  }
}

Tournaments.propTypes = {
  players: PropTypes.object.isRequired,
  started: PropTypes.bool.isRequired,
};

export default Tournaments;