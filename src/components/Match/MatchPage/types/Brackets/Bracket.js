import React, { Fragment } from "react";
import classNames from "classnames";
import { Loader } from 'semantic-ui-react';

import Match from '../../Match';

export const TeamBox = props => {
  let content = props.team.name;
  if (!props.team.name) {
    content = (
        <Loader active inline size='small' />
    );
  }
  if (props.team.status === 'In Progress') {
    content = (
      <Match
        wrapper={ Fragment }
        playerA={ props.team.match.playerA }
        playerB={ props.team.match.playerB }
        winsA={ props.team.match.winsA }
        winsB={ props.team.match.winsB }
        gamesPlayed={ props.team.match.gamesPlayed }
        totalGames={ props.team.match.totalGames }
        displayProgress
        small
      />
    );
  }
  return (
    <div
      className={classNames("item-content", {
        winner: props.team.winner,
        loser: props.team.loser
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
