import { Player } from './Player';

export type Lobby = {
  admin: Player,
  token: string,
  players: Player[],
  bannedPlayers: string[],
};

