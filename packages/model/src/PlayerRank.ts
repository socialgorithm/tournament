import { Player } from "./Player";

export class PlayerRank {
    public player: Player;
    public why: string;
    constructor(player: Player, why: string) {
        this.player = player;
        this.why = why;
    }
}
