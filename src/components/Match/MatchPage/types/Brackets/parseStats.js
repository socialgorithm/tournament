export const parseStats = stats => {
  const matches = stats.matches;
  matches.reverse();
  const brackets = [];

  // Prepare a map of matches for quick reference
  const matchesRef = {};
  matches.forEach(match => {
    matchesRef[match.uuid] = match;
  });

  matches.filter(
    match => match.parentMatches.length === 0
  ).forEach(match => {
    brackets.push(addMatch(match, matchesRef));
  });

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

  if (match.stats.winner === -1) {
    if (match.stats.state === "finished") {
      matchBracket.name = "Tie";
    }
  } else {
    const winner = match.players[match.stats.winner].token;
    matchBracket.name = winner;
  }

  // add the parents
  const parentLessPlayers = [0, 1];
  match.parentMatches.forEach(parentMatchInfo => {
    const parentMatch = matchesRef[parentMatchInfo.parent];
    if (!parentMatch) {
      console.warn("Cant fine parent match", parentMatchInfo);
    }
    const parentIndex = parentLessPlayers.indexOf(parentMatchInfo.playerIndex);
    parentLessPlayers.splice(parentIndex);
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
  parentLessPlayers.forEach(playerIndex => {
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
