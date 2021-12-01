import { Player } from "./Player";

export class Lobby {
  admin: Player;
  token: string;
  players: Player[];
  bannedPlayers: string[];
}
