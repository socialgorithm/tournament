export type Board = {
    cells: Cell[], // Needs to support Array<Array<Board>> for UTTT, maybe adding layout/how to draw info
    winner: Player | null,
    tie: boolean,
    timeout: boolean
};

export type Cell = {
    player: Player
}