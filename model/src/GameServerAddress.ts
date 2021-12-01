export type GameServerAddress = {
  /**
   * The address that the tournament server will use to connect to the game server
   */
  tournamentServerAccessibleAddress: string,
  /**
   * The address that will be sent to players, which they will use to connect to the game server
   */
  playerAccessibleAddress: string,
};
