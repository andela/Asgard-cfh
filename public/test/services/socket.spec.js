describe('socket factory', () => {
    let socket; // eslint-disable-line
    beforeEach(angular.mock.module('mean.system')); // eslint-disable-line
    beforeEach(inject((_socket_) => { // eslint-disable-line
    socket = _socket_;
  }));
  it('socket should exist', () => {
    expect(socket).toBeDefined(); // eslint-disable-line
  });
  it('socket.on should exist', () => { // eslint-disable-line
    expect(socket.on).toBeDefined(); // eslint-disable-line
  });
  it('socket.emit should should exist', () => { // eslint-disable-line
    expect(socket.emit).toBeDefined(); // eslint-disable-line
  });
  it('socket.removeAllListeners should exist', () => { // eslint-disable-line
    expect(socket.removeAllListeners).toBeDefined(); // eslint-disable-line
  });
});
