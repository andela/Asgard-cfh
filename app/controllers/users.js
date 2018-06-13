/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars').all();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendgridMail = require('@sendgrid/mail');
require('dotenv').config();

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);


const emailVerificationURL = process.env.EMAIL_VERIFICATION_URL;
const secret = process.env.SECRET;

/**
 * Auth callback
 */
exports.authCallback = (req, res) => {
  res.redirect('/#!/');
};

/**
 * Show login form
 */
exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */
exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */
exports.signout = (req, res) => {
  req.logout();
  res.send('loggedOut');
};

/**
 * Session
 */
exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = (req, res) => {
  /* eslint-disable */
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        /* eslint-enable */
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};


/**
 * Create user
 */
exports.create = (req, res, next) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
          req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

exports.signUp = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    })
      .exec((err, user) => {
        if (err) return err;
        if (!user) {
          const newUser = new User(req.body);
          const { _id, email } = newUser;
          newUser.provider = 'local';
          const temporaryToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            _id,
            email
          }, secret);
          newUser.save((error) => {
            if (error) {
              return res.redirect('/#!/signup?error=unknown', {
                errors: error.errors,
                user: newUser
              });
            }
            sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: newUser.email,
              from: 'noreply@asgardcfh.com',
              subject: 'CFH EMAIL VERIFICATION',
              text: `Hello ${newUser.name} Welcome to Card for Humanity, please kindly click ${emailVerificationURL}/activate/${temporaryToken}>here to complete your registration process`,
              html: `Hello <strong>${newUser.name}</strong><br><br> Welcome to Card for Humanity, please kindly click the link to complete your activation:<br><br><a href=${emailVerificationURL}/activate/${temporaryToken}>emailVerificationURL/activate/</a>`,
            };
            sendgridMail.send(msg, (err) => {
              if (err) return err;
              return res.status(201).send({
                message: 'Signed up successfully, please check email for activation link'
              });
            });
          });
        } else {
          return res.redirect('/#!/signup?error=existinguser');
        }
      });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

exports.sendCredentials = (req, res) => {
  if (req.params.token) {
    const { token } = req.params;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Activation link has expired' });
      }
      User.findOne({
        /* eslint-disable */
        _id: decoded._id
        /* eslint-enable */
      }).exec((err, user) => {
        if (err) return err;
        user.active = true;
        user.save((err) => {
          if (err) {
            return err;
          }
          sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: user.email,
            from: 'noreply@asgard_cfh.com',
            subject: 'Account Activated',
            text: `Hello ${user.name} Your Account has been successfully activated`,
            html: `Hello <strong>${user.name} Your Account has been successfully activated`,
          };
          sendgridMail.send(msg);

          return res.redirect('#!/activationComplete');
        });
      });
    });
  } else {
    return res.status(404).json({ message: 'Token Not found' });
  }
};


exports.checkCredentials = (req, res, next) => {
  const token = req.body.token || req.body.query || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Invalid token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({ success: false, message: 'No token provided' });
  }
};

exports.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(406).json({
      error: 'Please fill in required fields'
    });
  }
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    if (!user.active) {
      return res.status(401).json({ message: 'You need to confirm your email to activate your account' });
    }
    if (user && bcrypt.compareSync(req.body.password, user.hashed_password)) {
      const {
        _id,
        email,
        name,
      } = user;
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        _id,
        email,
        name
      }, secret);
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).send({
          message: 'Logged in Successfully',
          token
        });
      });
    }
  });
};


/**
 * Assign avatar to user
 */
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
        // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
 *  Show profile
 */
exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */
exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};

/**
 * Invite user to play game.
 */
exports.invite = (req, res) => {
  const { recieverEmail, gameURL } = req.body;
  const { name } = req;
  const msg = {
    from: 'cfh@andela.com',
    to: recieverEmail,
    subject: `${name} is inviting you to join a game`,
    html: `<h1>Cards For Humanity Asgard</h1><p>${name} is inviting you to join this game ${gameURL}</p>`
  };

  sendgridMail.send(msg, (err, info) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    } else {
      res.status(200).json({
        message: 'Email sent successfully',
        sentInfo: info
      });
    }
  });
};

exports.searchUser = (req, res) => {
  const { term } = req.body;
  const escapeRegex = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const searchQuery = new RegExp(escapeRegex, 'gi');
  const foundUser = [];
  User.find()
    .or([
      { name: searchQuery }, { email: searchQuery }
    ])
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          message: 'Server Error'
        });
      }
      if (users.length === 0) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      users.forEach((user) => {
        const userInfo = {
          email: user.email,
          name: user.name
        };
        foundUser.push(userInfo);
      });
      return res.status(200).json({
        message: 'Users Found',
        foundUser
      });
    });
};
