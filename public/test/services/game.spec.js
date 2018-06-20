describe('Games factory', () => {
  let Games;
  let app;

  beforeEach(angular.mock.module('mean.system'));

  beforeEach(inject(function(_game_){
    Games = _game_;
  })
  );

  it('should exist', () => {
    expect(Games).toBeDefined();
  });

  it('should add 2 + 2', () => {
    expect(2 + 2).toEqual(4);
  });
});
