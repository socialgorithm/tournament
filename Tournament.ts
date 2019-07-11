import { Player } from "@socialgorithm/game-server";

export type Tournament = {
  tournamentID: string,
  players: Player[],
  lobby: string,
  options: TournamentOptions,
  started: boolean,
  finished: boolean,
  ranking: Player[],
  waiting: boolean, // whether we're waiting for the user (for non automatic tournament mode)
};

export type TournamentOptions = {
  gameAddress: string,
  autoPlay: boolean,
  numberOfGames: number,
  timeout: number,
  type: string,
};
