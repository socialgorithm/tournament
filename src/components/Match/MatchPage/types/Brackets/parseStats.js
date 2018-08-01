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
    brackets.push(addMatch(nextMatch, matchesRef, false, false, true));
  }

  brackets.reverse();

  return brackets;
};

export default parseStats;

const addMatch = (match, matchesRef, winner, loser, topLevel, currentStats) => {
  const matchBracket = {
    name: "",
    playerIndex: -1,
    status: match.stats.state,
    match: {
      players: match.players,
      stats: match.stats,
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
    topLevel,
    currentStats,
    children: []
  };

  parsedMatches.push(match.uuid);

  if (match.stats.winner === -1) {
    if (match.stats.state === "finished") {
      matchBracket.name = "Tie";
    }
  } else {
    matchBracket.name = match.players[match.stats.winner].token;
    matchBracket.playerIndex = match.stats.winner;
  }

  // add the parents
  const parentLessPlayers = {
    0: true,
    1: true,
  };
  const addedParentMatches = [];
  if (match.parentMatches) {
    match.parentMatches.forEach(parentMatchInfo => {
      const parentMatch = matchesRef[parentMatchInfo.parent];
      if (!parentMatch) {
        console.warn("Cant fine parent match", parentMatchInfo);
      }
      parentLessPlayers[parentMatchInfo.playerIndex] = false;
      if (addedParentMatches.indexOf(parentMatchInfo.parent) > -1) {
        // this parent was already added, this must be a tie
        return;
      }
      addedParentMatches.push(parentMatchInfo.parent);
      matchBracket.children.push(
        addMatch(
          parentMatch,
          matchesRef,
          parseInt(match.stats.winner, 10) === parseInt(parentMatchInfo.playerIndex, 10),
          parseInt(match.stats.winner, 10) === 1 - parseInt(parentMatchInfo.playerIndex, 10),
          false,
          parentMatch.stats
        )
      );
    });
  }

  // Add parents that are not a match (first rounds)
  Object.keys(parentLessPlayers).forEach(playerIndex => {
    if (!parentLessPlayers[playerIndex]) {
      return;
    }
    const player = match.players[playerIndex].token;
    matchBracket.children.push({
      name: player,
      playerIndex: playerIndex,
      status: "finished",
      winner: parseInt(match.stats.winner, 10) === parseInt(playerIndex, 10),
      loser: parseInt(match.stats.winner, 10) === 1 - parseInt(playerIndex, 10),
      children: [],
      currentStats: match.stats,
    });
  });

  return matchBracket;
};
