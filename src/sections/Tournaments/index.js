import React from 'react';
import { List } from 'semantic-ui-react';

class Tournaments extends React.Component {
  render() {
    debugger;
    return (
        <div>
          {
            this.props.rounds.map((round, $index) => (
              <div>
                {
                  round.games.map((game, $index) => (
                      <div>
                        { game.result }
                      </div>
                  ))
                }
              </div>
            ))
          }
        </div>
    );
  }
}


Tournaments.propTypes = {
  rounds: React.PropTypes.array.isRequired,
};

export default Tournaments;