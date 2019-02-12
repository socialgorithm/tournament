import { Player } from "../../../Player";
import { Game } from "./Game";

export type GameUpdatePayload = {
    stats: any,
};

export type GameEndPayload = {
    winner: Player | null,
    tie: boolean,
    duration: number,
    stats: any,
    message: string, // optional message for the UI
};

export type GameMessage = {
    type: 'UPDATE' | 'END',
    payload: any,
};

export class GameRunner {
    game: Game;
    gameSocket: any;
    
    /**
     * Play an individual game between two players
     */
    public start() {
        this.sendToGame({
            type: 'START',
            payload: {
                players: this.game.players,
            },
        });
    }

    private onFinish(data: GameEndPayload) {
        this.game.stats = data.stats;
        this.game.winner = data.winner;
        this.game.tie = data.tie;
        this.game.duration = data.duration;
        this.game.message = data.message;

        // publish game end event
    }

    private onUpdate(data: GameUpdatePayload) {
        this.game.stats = data.stats;
    }

    private onGameToServer(data: GameMessage) {
        switch (data.type) {
            case 'UPDATE':
                this.onUpdate(data.payload);
                break;
            case 'END':
                this.onFinish(data.payload);
                break;
            default:
                console.warn('Unsupported message from game server');
        }
    }

    private onPlayerToGame(player: Player, data: any) {
        // received message from player, relay it to the game server
    }

    private onGameToPlayer(player: Player, data: any) {
        // game server -> player
    }

    private sendToGame(data: any) {

    }
}