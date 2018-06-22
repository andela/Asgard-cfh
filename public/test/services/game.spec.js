describe('Games factory', () => {
  let Games;
  // let app;
  let socket = 

  beforeEach(angular.mock.module('mean.system'));

  beforeEach(inject((_game_) => {
    Games = _game_;
    console.log(Games);
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

  // it('Games.sendUpdate should exist', () => {
  //   expect(Games.GameController).toBeDefined();
  // });
});
