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

  console.log('brackets', brackets);

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
    const winner = match.players[match.stats.winner].token;
    matchBracket.name = winner;
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
        parentMatchInfo.playerIndex === match.stats.winner,
        parentMatchInfo.playerIndex === 1 - match.stats.winner
      )
    );
  });

  // Add parents that are not a match (first rounds)
  Object.keys(parentLessPlayers).forEach(playerIndex => {
    if (!parentLessPlayers[playerIndex]) {
      return;
    }
    const player = match.players[playerIndex].token;
    matchBracket.children.push({
      name: player,
      status: "Finished",
      winner: match.stats.winner === playerIndex,
      loser: match.stats.winner === 1 - playerIndex,
      children: []
    });
  });

  return matchBracket;
};
