import { Player } from "@socialgorithm/game-server/src/constants";
import { Game } from "./game/Game";

export type Match = {
    matchID: string,
    players: Player[],
    games: Game[],
    state: "playing" | "finished" | "upcoming",
};

export type MatchOptions = {
    maxGames: number,
    timeout: number,
    autoPlay: boolean,
};