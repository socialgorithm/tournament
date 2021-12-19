import { Match } from "@socialgorithm/model";

export type MatchParent = {
    playerIndex: number;
    parent: string;
};

export type DoubleEliminationMatch = Match & {
    parentMatches: MatchParent[],
};
