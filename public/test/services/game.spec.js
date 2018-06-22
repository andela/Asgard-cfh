describe('Games factory', () => {
  let Games;

  beforeEach(angular.mock.module('mean.system'));

  beforeEach(inject((_game_) => {
    Games = _game_;
  }));

  it('should exist', () => {
    expect(Games).toBeDefined();
  });
  it('Games.startGame should exist', () => {
    expect(Games.startGame).toBeDefined();
  });
  it('Games.pickCards should exist', () => {
    expect(Games.pickCards).toBeDefined();
  });
  it('Games.joinGame should exist', () => {
    expect(Games.joinGame).toBeDefined();
  });
  it('Games.leaveGame should exist', () => {
    expect(Games.leaveGame).toBeDefined();
  });
  it('Games.pickWinning should exist', () => {
    expect(Games.pickWinning).toBeDefined();
  });
  it('Games.id should be null', () => {
    expect(Games.id).toBeNull();
  });
  it('Games.gameID should be null', () => {
    expect(Games.gameID).toBeNull();
  });
  it('Games.playerIndex should be 0', () => {
    expect(Games.playerIndex).toBe(0);
  });
  it('Games.winningCard should be -1', () => {
    expect(Games.winningCard).toBe(-1);
  });
  it('Games.winningCardPlayer should be -1', () => {
    expect(Games.winningCardPlayer).toBe(-1);
  });
  it('Games.gameWinner should be -1', () => {
    expect(Games.gameWinner).toBe(-1);
  });
  it('Games.czar should be null', () => {
    expect(Games.czar).toBeNull();
  });
  it('Games.playerMinLimit should be 3', () => {
    expect(Games.playerMinLimit).toBe(3);
  });
  it('Games.playerMaxLimit should be 6', () => {
    expect(Games.playerMaxLimit).toBe(6);
  });
  it('Games.pointLimit should be null', () => {
    expect(Games.pointLimit).toBeNull();
  });
  it('Games.state should be null', () => {
    expect(Games.state).toBeNull();
  });
  it('Games.round should be 0', () => {
    expect(Games.round).toBe(0);
  });
  it('Games.time should be 0', () => {
    expect(Games.time).toBe(0);
  });
  it('Games.curQuestion should be null', () => {
    expect(Games.curQuestion).toBeNull();
  });
  it('Games.notification should be null', () => {
    expect(Games.notification).toBeNull();
  });
  it('Games.timeLimits should be {}', () => {
    expect(JSON.stringify(Games.timeLimits)).toBe(JSON.stringify({}));
  });
  it('Games.joinOverride should be false', () => {
    expect(Games.joinOverride).toBeFalsy(true);
  });
});
