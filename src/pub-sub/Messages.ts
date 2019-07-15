import { Events, Player } from "@socialgorithm/model";

export type ServerToPlayerMessage = {
  player: Player,
  event: Events.IEvent,
};
