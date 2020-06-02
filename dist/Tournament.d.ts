import { GameServerAddress } from "./GameServerAddress";
import { Player } from "./Player";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    lobby: string;
    options: TournamentOptions;
    started: boolean;
    finished: boolean;
    ranking: Player[];
    waiting: boolean;
};
export declare type TournamentOptions = {
    gameAddress: GameServerAddress;
    autoPlay: boolean;
    numberOfGames: number;
    timeout: number;
    type: string;
};
