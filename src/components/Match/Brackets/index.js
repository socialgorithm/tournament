import React from "react";

import Bracket from "./Bracket";
import "./index.css";
import { SAMPLE_STATS } from './sample';

// convert the sample into the bracket data

const convertStats = (stats) => {
  const matches = stats.matches;
  matches.reverse();
  const brackets = [];

  brackets.push({
    name: matches[0].players[0].token,
    winner: true,
    children: [],
  });

  return brackets;
};

const data = convertStats(SAMPLE_STATS);

// const testData = [
//   {
//     name: "",
//     children: [
//       {
//         name: "Test Name A",
//         winner: true,
//         children: [
//           {
//             name: "Test Name A",
//             winner: true,
//             children: [
//               {
//                 name: "Test Name A fdg dagadfgaerhadg adfgadfhadg adgadga",
//                 winner: true
//               },
//               {
//                 name: "Test Name C",
//                 loser: true
//               }
//             ]
//           },
//           {
//             name: "Test Name B",
//             loser: true,
//             children: [
//               {
//                 name: "Test Name D",
//                 loser: true
//               },
//               {
//                 name: "Test Name B",
//                 winner: true
//               }
//             ]
//           }
//         ]
//       },
//       {
//         name: "Test Name F",
//         loser: true,
//         children: []
//       }
//     ]
//   },
//   {
//     name: "",
//     status: 'In Progress',
//     match: {
//         playerA: "Test Name X",
//         playerB: "Test Name W",
//         winsA: 3,
//         winsB: 0,
//         gamesPlayed: 3,
//         totalGames: 10,
//     },
//     children: [
//       {
//         name: "Test Name X"
//       },
//       {
//         name: "Test Name W"
//       }
//     ]
//   },
//   {
//     name: "",
//     children: [
//       {
//         name: "Test Name T"
//       },
//       {
//         name: "Test Name Y"
//       }
//     ]
//   }
// ];

export default props => {
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
