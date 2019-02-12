import { Match } from "../MatchRunner";

export type MatchParent = {
    playerIndex: number;
    parent: string;
}

export type DoubleEliminationMatch = Match & {
    parentMatches: MatchParent[],
};