describe('global factory', () => {
    let Global; // eslint-disable-line
    beforeEach(angular.mock.module('mean.system')); // eslint-disable-line
    beforeEach(inject((_Global_) => { // eslint-disable-line
    Global = _Global_;
  }));

  it('Global should exist', () => {
    expect(Global).toBeDefined(); // eslint-disable-line
  });
  it('Global.user should exist', () => { // eslint-disable-line
    expect(Global.user).toBeUndefined(); // eslint-disable-line
  });
  it('Global.authenticated should be false', () => { // eslint-disable-line
    expect(Global.authenticated).toBeFalsy(); // eslint-disable-line
  });
});

