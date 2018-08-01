import React, { Fragment } from "react";
import classNames from "classnames";
import { Loader, Icon } from 'semantic-ui-react';

import Match from '../../Match';

export default (props) => {
    let content = props.team.name;
    if (!props.team.name) {
      content = (
          <Loader active inline size='small' />
      );
    }
    if (props.team.status === 'playing') {
      content = (
        <Match
          wrapper={ Fragment }
          playerA={ props.team.match.playerA }
          playerB={ props.team.match.playerB }
          winsA={ props.team.match.winsA }
          winsB={ props.team.match.winsB }
          gamesPlayed={ props.team.match.gamesPlayed }
          totalGames={ props.totalGames }
          displayProgress
          small
        />
      );
    } else {
      if (props.champion) {
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
      } else if (props.team.status === 'finished' && props.team.currentMatch) {
        const playerIndex = props.team.playerIndex;
        if (playerIndex > -1) {
          content = (
            <Fragment>
              { content }
              <div className="bottom">
                <span>
                  W { props.team.currentMatch.stats.wins[playerIndex] || 0 } - 
                  L { props.team.currentMatch.stats.wins[1 - playerIndex] || 0 } - 
                  T { props.team.currentMatch.stats.ties || 0 }
                </span>
              </div>
            </Fragment>
          );
        }
      }
    }
    return (
      <div
        className={classNames("item-content", {
          winner: props.team.winner,
          loser: props.team.loser,
          tie: props.team.tie,
          champion: props.champion,
        })}
      >
        { content }
      </div>
    );
  };