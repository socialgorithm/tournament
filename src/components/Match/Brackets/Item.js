import React from "react";
import classNames from "classnames";

export const Item = props => {
  if (!props.item.children || props.item.children.length < 1) {
    return (
      <div
        className={classNames("item-content", {
          winner: props.item.winner,
          loser: props.item.loser
        })}
      >
        {props.item.name}
      </div>
    );
  }
  return (
    <div className="item">
      <div className="item-parent">
        <div
          className={classNames("item-content", {
            winner: props.item.winner,
            loser: props.item.loser
          })}
        >
          {props.item.name}
        </div>
      </div>
      {props.item.children &&
        props.item.children.length > 0 && (
          <div className="item-children">
            {props.item.children.map((child, $index) => (
              <div className="item-child" key={$index}>
                <Item item={child} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Item;
