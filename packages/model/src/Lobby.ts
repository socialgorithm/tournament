import { Player } from "./Player";
import { Tournament } from "./Tournament";

export class Lobby {
  admin: Player;
  bannedPlayers: string[];
  players: Player[];
  token: string;
  tournament?: Tournament
}
