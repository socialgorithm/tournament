// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:matchRunner");

import * as io from "socket.io-client";

import { Game, Match, Messages } from "@socialgorithm/model";
import { EventName } from "@socialgorithm/model/dist/Events";
import { Events as PubSubEvents, PubSub } from "../../pub-sub";

export class MatchRunner {
  private pubSub: PubSub;
  private gameServerSocket: SocketIOClient.Socket;
  private playerTokens: { [name: string]: string };

  constructor(private match: Match, private tournamentID: string, private gameServerAddress: string) {
    this.gameServerSocket = io(gameServerAddress, { reconnection: true, timeout: 2000 });
    this.gameServerSocket.on("connect", this.sendMatchToGameServer);
    this.gameServerSocket.on(EventName.MatchCreated, this.onMatchCreated);
    this.gameServerSocket.on(EventName.GameEnded, this.onGameEnded);
    this.gameServerSocket.on(EventName.MatchEnded, this.onMatchEnded);

    this.gameServerSocket.on("disconnect", () => {
      debug("Connection to Game Server %s lost!", gameServerAddress);
    });

    this.pubSub = new PubSub();
  }

  private sendMatchToGameServer = () => {
    debug("Sending match to game server: %O", this.match);
    this.gameServerSocket.emit(EventName.CreateMatch, { players: this.match.players, options: this.match.options });
    this.match.state = "playing";
  }

  private onMatchCreated = (message: Messages.MatchCreatedMessage) => {
    debug("Received match created message %O", message);
    // These tokens are recognised on/sent by the game server (e.g. stats updates), save them for later mapping
    this.playerTokens = message.playerTokens;
    this.sendGameServerHandoffToPlayers();
  }

  private sendGameServerHandoffToPlayers = () => {
    for (const [player, token] of Object.entries(this.playerTokens)) {
      this.pubSub.publish(
        PubSubEvents.ServerToPlayer,
        {
          player,
          event: EventName.GameServerHandoff,
          payload: {
            gameServerAddress: this.gameServerAddress,
            token,
          },
        },
      );
    }
  }

  private onGameEnded = (game: Game) => {
    debug("Finished game, winner %s", game.winner);
    // Convert tokens to player names
    game.players = game.players.map(token => this.convertPlayerTokenToPlayerName(token));
    game.winner = this.convertPlayerTokenToPlayerName(game.winner);

    this.match.games.push(game);
    this.updateMatchStats();

    this.pubSub.publishNamespaced(
      this.tournamentID,
      PubSubEvents.MatchUpdated,
      this.match,
    );
  }

  private onMatchEnded = () => {
    this.match.state = "finished";
    this.updateMatchStats();
    debug("Finished match %o", this.match.stats);
    this.gameServerSocket.disconnect();
    this.pubSub.publishNamespaced(
      this.tournamentID,
      PubSubEvents.MatchEnded,
      this.match,
    );
  }

  private updateMatchStats = () => {
    // Calculate match stats here
    this.match.stats.gamesCompleted = this.match.games.length;
    this.match.stats.gamesTied = this.match.games.filter(game => game.tie).length;
    this.match.stats.wins = this.match.players.map(() => 0);
    this.match.games.forEach(game => {
      if (!game.tie && game.winner) {
        this.match.stats.wins[this.match.players.indexOf(game.winner)]++;
      }
    });

    // Get the match winner
    let maxWins = this.match.stats.wins[0];
    let maxIndex = 0;

    for (let i = 1; i < this.match.stats.wins.length; i++) {
      if (this.match.stats.wins[i] > maxWins) {
        maxIndex = i;
        maxWins = this.match.stats.wins[i];
      }
    }

    this.match.winner = maxIndex;
  }

  private convertPlayerTokenToPlayerName = (tokenToConvert: string) => {
    for (const [player, playerToken] of Object.entries(this.playerTokens)) {
      if (tokenToConvert === playerToken) {
        return player;
      }
    }
    return tokenToConvert;
  }
}
