import { Tournament } from "./Tournament";
import { Player } from "./Player";

export type Lobby = {
  admin: Player,
  bannedPlayers: string[],
  players: Player[],
  token: string,
  tournament?: Tournament
};
