/**
 * Parse Tournament Stats and generate the appropriate data structure
 * for the brackets to be rendered.
 * 
 * @param {*} stats 
 */
export const parseStats = stats => {
  const matches = stats.matches;
  const brackets = [];
  if (!matches) return brackets;
  // Prepare a map of matches for quick reference
  const matchesRef = {};
  matches.forEach(match => {
    matchesRef[match.matchID] = match;
  });

  // Figure out the top level matches
  // these are matches that are not parents of any match
  const topLevelMatches = matches.map(match => match.matchID);
  matches.filter(
    match => match.parentMatches && match.parentMatches.length > 0
  ).forEach(match => {
    match.parentMatches.forEach(parentMatch => {
      const index = topLevelMatches.indexOf(parentMatch.parent);
      if (index > -1) {
        topLevelMatches.splice(index, 1);
      }
    });
  });

  topLevelMatches.forEach(matchUUID => {
    const match = matches.find(eachMatch => eachMatch.matchID === matchUUID);
    brackets.push(addMatch(match, matchesRef, false, false, true));
  });

  return brackets;
};

export default parseStats;

const addMatch = (match, matchesRef, winner, loser, topLevel, currentMatch) => {
  const matchBracket = {
    name: "",
    playerIndex: -1,
    match,
    tie: match.winner === -1 && match.state === "finished",
    winner,
    loser,
    topLevel,
    currentMatch,
    children: []
  };

  if (match.winner === -1) {
    if (match.state === "finished") {
      matchBracket.name = "Tie";
    }
  } else {
    matchBracket.name = match.players[match.winner];
  }

  if (currentMatch) {
    matchBracket.playerIndex = currentMatch.players.findIndex(player => player === matchBracket.name);
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
        console.warn("Can't fine parent match", parentMatchInfo);
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
          parseInt(match.winner, 10) === parseInt(parentMatchInfo.playerIndex, 10),
          parseInt(match.winner, 10) === 1 - parseInt(parentMatchInfo.playerIndex, 10),
          false,
          match
        )
      );
    });
  }

  // Add parents that are not a match (first rounds)
  Object.keys(parentLessPlayers).forEach(playerIndex => {
    if (!parentLessPlayers[playerIndex]) {
      return;
    }
    const player = match.players[playerIndex];
    matchBracket.children.push({
      name: player,
      playerIndex: playerIndex,
      match: null,
      winner: parseInt(match.winner, 10) === parseInt(playerIndex, 10),
      loser: parseInt(match.winner, 10) === 1 - parseInt(playerIndex, 10),
      children: [],
      currentMatch: match,
    });
  });

  return matchBracket;
};
