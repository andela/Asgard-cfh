var validation = require('../config/middlewares/validations'); //eslint-disable-line
var middleWare = require('../config/middlewares/isLoggedIn'); //eslint-disable-line

var users = require('../app/controllers/users'); //eslint-disable-line
var answers = require('../app/controllers/answers'); //eslint-disable-line
var questions = require('../app/controllers/questions'); //eslint-disable-line
var games = require('../app/controllers/game'); //eslint-disable-line
var avatars = require('../app/controllers/avatars'); //eslint-disable-line
var index = require('../app/controllers/index'); //eslint-disable-line

module.exports = function (app, passport) { //eslint-disable-line
  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/activate/:token', users.sendCredentials);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

  // Setting up the users api
  app.post('/users', users.create);
  app.post(
    '/api/auth/signup',
    validation.signupChecks,
    validation.validateSignup,
    users.signUp
  );

  app.post('/users/avatars', users.avatars);

  // Donation Routes
  app.post('/donations', users.addDonation);
  app.get('/api/donations', middleWare.isLoggedIn, users.getDonations);

  app.post(
    '/api/auth/login',
    validation.confirmUserExistence,
    passport.authenticate('local'), users.login
  );

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Game Routes
  app.post('/api/game/save', games.saveGame);
  app.post('/api/games/:id/start', games.startGame);
  app.get('/api/games/history', middleWare.isLoggedIn, games.gameHistory);
  app.get('/api/leaderboard', middleWare.isLoggedIn, games.leaderBoard);

  // Avatar Routes
  app.get('/avatars', avatars.allJSON);

  // Home route
  app.get('/play', index.play);
  app.get('/', index.render);

  // Invitation
  app.post('/api/invite', middleWare.isLoggedIn, users.invite);

  //  User Profile
  app.get('/api/profile/:id', users.profile);

  // Search
  app.post('/api/search', users.searchUser);

  // send friends invitation
  app.post('/api/invite-friend', middleWare.isLoggedIn, users.friendInvite);

  // accept friends invitation
  app.post('/api/accept-friend-invite', middleWare.isLoggedIn, users.acceptFriend);

  // reject friends invitation
  app.post('/api/reject-friend-invite', middleWare.isLoggedIn, users.rejectFriend);
};
