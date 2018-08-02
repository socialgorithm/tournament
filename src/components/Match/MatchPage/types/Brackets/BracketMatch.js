import React, { Fragment } from "react";
import classNames from "classnames";
import { Loader, Icon } from 'semantic-ui-react';
import scrollToComponent from 'react-scroll-to-component';

import Match from '../../Match';

export default class BracketMatch extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
    };
  }

  updateRef = (ref) => {
    this.setState({
      ref,
    });
  };

  componentDidUpdate() {
    this.scroll();
  }

  componentDidMount() {
    this.scroll();
  }

  scroll() {
    if (this.props.bracket.match && this.props.bracket.match.stats.state === 'playing' && this.state.ref) {
      // this match is being played, scroll to it
      scrollToComponent(this.state.ref, {
        duration: 500,
      });
    }
  }

  render() {
    const { bracket, champion, totalGames } = this.props;
    let content = bracket.name;
    if (!bracket.name) {
      content = (
          <Loader active inline size='small' />
      );
    }
    if (bracket.match && bracket.match.stats.state === 'playing') {
      content = (
        <Match
          wrapper={ Fragment }
          match={ bracket.match }
          totalGames={ totalGames }
          displayProgress
          small
        />
      );
    } else {
      if (champion) {
        content = (
          <Fragment>
            <div className="top"><span>Winner Winner</span></div>
            <span className="champion-text">
              <Icon name='trophy' />
              { content }
            </span>
            <div className="bottom"><span>Chicken Dinner!</span></div>
          </Fragment>
        );
      } else if (bracket.currentMatch && bracket.currentMatch.stats.state === 'finished') {
        const playerIndex = bracket.playerIndex;
        if (playerIndex > -1) {
          content = (
            <Fragment>
              { content }
              <div className="bottom">
                <span>
                  W { bracket.currentMatch.stats.wins[playerIndex] || 0 } - 
                  L { bracket.currentMatch.stats.wins[1 - playerIndex] || 0 } - 
                  T { bracket.currentMatch.stats.gamesTied || 0 }
                </span>
              </div>
            </Fragment>
          );
        }
      }
    }
    return (
      <div
        ref={ this.updateRef }
        className={classNames("item-content", {
          winner: bracket.winner,
          loser: bracket.loser,
          tie: bracket.tie,
          champion: champion,
        })}
      >
        { content }
      </div>
    );
  }
}