import { Match } from "@socialgorithm/model";
export declare type MatchParent = {
    playerIndex: number;
    parent: string;
};
export declare type DoubleEliminationMatch = Match & {
    parentMatches: MatchParent[];
};
