import React from "react";

import Item from "./Item";
import "./index.css";

const testData = {
  name: "Test Name A",
  winner: true,
  children: [
    {
      name: "Test Name A",
      winner: true,
      children: [
        {
          name: "Test Name A",
          winner: true,
          children: [
            {
              name: "Test Name A",
              winner: true
            },
            {
              name: "Test Name C",
              loser: true
            }
          ]
        },
        {
          name: "Test Name B",
          loser: true,
          children: [
            {
              name: "Test Name D",
              loser: true
            },
            {
              name: "Test Name B",
              winner: true
            }
          ]
        }
      ]
    },
    {
      name: "Test Name F",
      loser: true,
      children: []
    }
  ]
};

export default props => {
  return (
    <div className="tournament-bracket">
      <Item item={testData} />
    </div>
  );
};
