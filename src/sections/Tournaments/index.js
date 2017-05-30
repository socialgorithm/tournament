import React from 'react';
import PropTypes from 'prop-types';
import jsplumb from 'jsplumb';
import { Segment } from 'semantic-ui-react';

import './index.css';

import TournamentGame from '../../components/TournamentGame/index';

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

  render() {
    const header = (this.props.started) ? 'Tournament' : 'Waiting for Tournament to start...';
    return (
      <div>
        <h1>{ header }</h1>
        <Segment loading={ !this.props.started }>
          <main id="tournament">
            {
              this.props.rounds.map((round, $roundIndex) => (
                <div className={ `round round-${$roundIndex + 1}` } key={ `round-${$roundIndex}` }>
                  {
                    round.games.map((game, $gameIndex) => (
                      <TournamentGame
                        game={ game }
                        isPlaying={ false }
                        gameIndex={ $gameIndex }
                        roundIndex={ $roundIndex }
                        key={ `game-${$gameIndex}` }
                        jsPlumbInstance={ this.jsPlumbInstance }
                      />
                    ))
                  }
                </div>
              ))
            }
          </main>
        </Segment>
      </div>
    );
  }
}

Tournaments.propTypes = {
  rounds: PropTypes.array.isRequired,
  started: PropTypes.bool.isRequired,
};

export default Tournaments;