import React from "react";
import { Message } from "semantic-ui-react";

import Bracket from "./Bracket";
import "./index.scss";
import parseStats from './parseStats';

export default class Brackets extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: this.updateStats(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stats !== this.props.stats) {
      this.setState({
        data: this.updateStats(nextProps),
      });
    }
  }

  updateStats = (props) => {
    return parseStats(props.stats);
  };

  render () {
    if (!this.props.stats) {
      return (
        <Message>Waiting for Tournament Stats...</Message>
      );
    }
    return (
      <div>
        {this.state.data.map((bracket, $index) => (
          <div className="tournament-bracket" key={ bracket.match.matchID }>
              <Bracket
                finished={ this.props.stats.finished }
                item={bracket}
                key={$index}
                totalGames={ this.props.stats.options.numberOfGames }
              />
          </div>
        ))}
      </div>
    );
  }
}
