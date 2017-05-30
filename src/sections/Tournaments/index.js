import React from 'react';
import PropTypes from 'prop-types';
import jsplumb from 'jsplumb';
import { Segment, Table, Loader } from 'semantic-ui-react';

import './index.css';

class Tournaments extends React.Component {
  /**
   * Prepare a jsPlumb instance
   */
  constructor(props) {
    super(props);
    const jsPlumb = (jsplumb.jsPlumb) ? jsplumb.jsPlumb : jsplumb;
    this.jsPlumbInstance = jsPlumb.getInstance({
      Container: this.canvas,
      ConnectionsDetachable: false,
      ConnectionOverlays: [
        ['Arrow', {
          location: 1,
          width: 8,
          length: 6,
          foldback: 1,
        }],
        ['Label', {
          location: 0.1,
          id: 'label',
          cssClass: 'aLabel',
        }],
      ],
    });

    this.jsPlumbInstance.importDefaults({
      PaintStyle: {
        strokeWidth: 2,
        stroke: 'rgb(184, 184, 184)',
      },
    });

    this.jsPlumbInstance.registerConnectionType('basic', {
      connector: ['StateMachine', { gap: 0 }],
      overlays: ['Arrow'],
    });
  };

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
      <div>
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
      </div>
    );
  }
}

Tournaments.propTypes = {
  players: PropTypes.object.isRequired,
  started: PropTypes.bool.isRequired,
};

export default Tournaments;