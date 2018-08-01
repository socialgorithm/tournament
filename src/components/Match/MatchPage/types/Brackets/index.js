import React from "react";
import { Message } from "semantic-ui-react";

import Bracket from "./Bracket";
import "./index.css";
import parseStats from './parseStats';

export default props => {
  if (!props.stats) {
    return (
      <Message>Waiting for Tournament Stats...</Message>
    );
  }
  const data = parseStats(props.stats);
  return (
    <div>
      {data.map((bracket, $index) => (
        <div className="tournament-bracket">
            <Bracket item={bracket} key={$index} />
        </div>
      ))}
    </div>
  );
};
