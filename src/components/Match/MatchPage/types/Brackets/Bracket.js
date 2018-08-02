import React, { Fragment } from "react";

import BracketMatch from './BracketMatch';

export const Bracket = props => {
  if (!props.item.children || props.item.children.length < 1) {
    return (
      <BracketMatch
        bracket={ props.item }
      />
    );
  }
  return (
    <div className="item">
      <div className="item-parent">
        <BracketMatch
          bracket={ props.item }
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
