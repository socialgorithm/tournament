import { Match } from "../match/Match";

export type MatchParent = {
    playerIndex: number;
    parent: string;
}

export type DoubleEliminationMatch = Match & {
    parentMatches: MatchParent[],
};