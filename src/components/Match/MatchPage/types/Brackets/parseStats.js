let parsedMatches = [];

/**
 * Parse Tournament Stats and generate the appropriate data structure
 * for the brackets to be rendered.
 * 
 * @param {*} stats 
 */
export const parseStats = stats => {
  const matches = stats.matches;
  matches.reverse();
  const brackets = [];
  parsedMatches = [];

  // Prepare a map of matches for quick reference
  const matchesRef = {};
  matches.forEach(match => {
    matchesRef[match.uuid] = match;
  });

  while(parsedMatches.length < matches.length) {
    const nextMatch = matches.find(match => parsedMatches.indexOf(match.uuid) < 0);
    brackets.push(addMatch(nextMatch, matchesRef));
  }

  return brackets;
};

export default parseStats;

const addMatch = (match, matchesRef, winner, loser) => {
  const matchBracket = {
    name: "",
    status: match.stats.state,
    match: {
      playerA: match.players[0].token,
      playerB: match.players[1].token,
      winsA: match.stats.wins[0],
      winsB: match.stats.wins[1],
      gamesPlayed: match.stats.games,
      totalGames: 10
    },
    tie: match.stats.winner === -1 && match.stats.state === "finished",
    winner,
    loser,
    children: []
  };

  parsedMatches.push(match.uuid);

  if (match.stats.winner === -1) {
    if (match.stats.state === "finished") {
      matchBracket.name = "Tie";
    }
  } else {
    matchBracket.name = match.players[match.stats.winner].token;
  }

  // add the parents
  const parentLessPlayers = {
    0: true,
    1: true,
  };
  match.parentMatches.forEach(parentMatchInfo => {
    const parentMatch = matchesRef[parentMatchInfo.parent];
    if (!parentMatch) {
      console.warn("Cant fine parent match", parentMatchInfo);
    }
    parentLessPlayers[parentMatchInfo.playerIndex] = false;
    matchBracket.children.push(
      addMatch(
        parentMatch,
        matchesRef,
        parseInt(match.stats.winner, 10) === parseInt(parentMatchInfo.playerIndex, 10),
        parseInt(match.stats.winner, 10) === 1 - parseInt(parentMatchInfo.playerIndex, 10),
      )
    );
  });

  // Add parents that are not a match (first rounds)
  Object.keys(parentLessPlayers).forEach(playerIndex => {
    if (!parentLessPlayers[playerIndex]) {
      return;
    }
    const player = match.players[playerIndex].token;
    console.log('adding final game', player, match.stats.winner, playerIndex);
    matchBracket.children.push({
      name: player,
      status: "finished",
      winner: parseInt(match.stats.winner, 10) === parseInt(playerIndex, 10),
      loser: parseInt(match.stats.winner, 10) === 1 - parseInt(playerIndex, 10),
      children: []
    });
  });

  return matchBracket;
};
