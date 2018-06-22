describe('GameController', () => {
  let $controller, GameController;

  beforeEach(angular.mock.module('ui.router'));
  beforeEach(angular.mock.module('ui.bootstrap'));
  beforeEach(angular.mock.module('mean.system'));

  beforeEach(inject((_$controller_, _$rootScope_, _$dialog_) => {
    $controller = _$controller_;
    const scope = _$rootScope_.$new();
    const dialog = _$dialog_;
    const $rootScope = _$rootScope_;
    GameController = $controller('GameController', { $scope: scope, $dialog: dialog, $rootScope });
  }));


  it('should exist', () => {
    expect(GameController).toBeDefined();
  });

//   it('Games.startGame should exist', () => {
//     expect(Games.startGame).toBeDefined();
//   });
//   it('Games.pickCards should exist', () => {
//     expect(Games.pickCards).toBeDefined();
//   });
//   it('Games.joinGame should exist', () => {
//     expect(Games.joinGame).toBeDefined();
//   });
//   it('Games.leaveGame should exist', () => {
//     expect(Games.leaveGame).toBeDefined();
//   });
//   it('Games.pickWinning should exist', () => {
//     expect(Games.pickWinning).toBeDefined();
//   });

  // it('Games.sendUpdate should exist', () => {
  //   expect(Games.GameController).toBeDefined();
  // });
});

