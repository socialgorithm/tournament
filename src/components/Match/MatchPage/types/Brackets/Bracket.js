import React, { Fragment } from "react";
import classNames from "classnames";
import { Loader, Icon } from 'semantic-ui-react';

import Match from '../../Match';

export const TeamBox = props => {
  console.log('render team', props.team);
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
    } else if (props.team.status === 'finished' && props.team.currentStats) {
      const winner = props.team.playerIndex;
      if (winner > -1) {
        content = (
          <Fragment>
            { content }
            <div className="bottom">
              <span>
                W { props.team.currentStats.wins[winner] } - 
                L { props.team.currentStats.wins[1 - winner] } - 
                T { props.team.currentStats.ties }
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

export const Bracket = props => {
  if (!props.item.children || props.item.children.length < 1) {
    return (
      <TeamBox
        team={ props.item }
      />
    );
  }
  return (
    <div className="item">
      <div className="item-parent">
        <TeamBox
          team={ props.item }
          totalGames={ props.totalGames }
          champion={ props.item.topLevel && props.finished }
        />
      </div>
      {props.item.children &&
        props.item.children.length > 0 && (
          <div className="item-children">
            {props.item.children.map((child, $index) => (
              <div className="item-child" key={$index}>
                <Bracket item={child} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Bracket;
