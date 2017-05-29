import React from 'react';
import './index.css';


const gameLayout = (game, index) => (
  <div key={index}>
    <li className="spacer">&nbsp;</li>
    <li className={"game game-top " + (game.playerA === game.winner ? "winner" : "")}>{game.playerA}</li>
    <li className="game game-spacer">&nbsp;</li>
    <li className={"game game-bottom " + (game.playerB === game.winner ? "winner" : "")}>{game.playerB}</li>
    <li className="spacer">&nbsp;</li>
  </div>
);
class Tournaments extends React.Component {
  render() {
    return (
        <main id="tournament">
          {
            this.props.rounds.map((round, $index) => (
              <div>
                <ul className={ "round " + "round-" + ($index + 1)}>
                  {
                    round.games.map((game, index) => (
                      gameLayout(game, index)
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </main>
    );
  }
}


Tournaments.propTypes = {
  rounds: React.PropTypes.array.isRequired,
};

export default Tournaments;