import React from 'react';
import PropTypes from 'prop-types';
import './index.css';


const gameLayout = (game, index) => ([
  <li key={index * 10 + 1}>&nbsp;</li>,
  <li className={"game game-top " + (game.playerA === game.winner ? "winner" : "")} key={index * 10 + 2}>{game.playerA}</li>,
  <li key={index * 10 + 3}>&nbsp;</li>,
  <li className={"game game-bottom " + (game.playerB === game.winner ? "winner" : "")} key={index * 10 + 4}>{game.playerB}</li>,
]);

class Tournaments extends React.Component {
  render() {
    return (
        <main id="tournament">
          {
            this.props.rounds.map((round, $index) => (
              <ul className={ `round round-${$index + 1}` }>
                {
                  round.games.map((game, index) => (
                    gameLayout(game, index)
                  ))
                }
              </ul>
            ))
          }
        </main>
    );
  }
}


Tournaments.propTypes = {
  rounds: PropTypes.array.isRequired,
};

export default Tournaments;