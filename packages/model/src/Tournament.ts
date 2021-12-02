import { GameServerAddress } from "./GameServerAddress";
import { Match } from "./Match";
import { Player } from "./Player";
import { PlayerRank } from "./PlayerRank";

export class Tournament {
  tournamentID: string;
  players: Player[];
  lobby: string;
  matches?: Match[];
  options: TournamentOptions;
  started: boolean;
  finished: boolean;
  ranking: PlayerRank[];
  waiting: boolean; // whether we're waiting for the user (for non automatic tournament mode)
};

export type TournamentOptions = {
  gameAddress: GameServerAddress,
  autoPlay: boolean,
  numberOfGames: number,
  timeout: number,
  type: string,
};
