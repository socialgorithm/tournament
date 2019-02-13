import { Match } from "../match/Match";
export declare type MatchParent = {
    playerIndex: number;
    parent: string;
};
export declare type DoubleEliminationMatch = Match & {
    parentMatches: MatchParent[];
};
