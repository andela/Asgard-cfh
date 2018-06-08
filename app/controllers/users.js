/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars').all();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const sendgridgMail = require('@sendgrid/mail');

const secret = process.env.SECRET;

/**
 * Auth callback
 */
exports.authCallback = (req, res) => {
  res.redirect('/#!/app');
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
  res.redirect('/');
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
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
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
        if (!user) {
          const newUser = new User(req.body);
          const { _id, email } = newUser;
          newUser.provider = 'local';
          newUser.temporaryToken = jwt.sign({
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
            sendgridgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: newUser.email,
              from: 'noreply@asgardcfh.com',
              subject: 'CFH EMAIL VERIFICATION',
              text: `Hello ${newUser.name} Welcome to Card for Humanity, please kindly click http://localhost:3000/activate/${newUser.temporaryToken}>here to complete your registration process`,
              html: `Hello <strong>${newUser.name}</strong><br><br> Welcome to Card for Humanity, please kindly click the link to complete your activation:<br><br><a href="http://localhost:3000/activate/${newUser.temporaryToken}">http://localhost:3000/activate/</a>`,
            };
            sendgridgMail.send(msg, (err) => {
              if (err) return err;
              return res.status(201).send({
                message: 'Signed up successfully, please check email for activation link',
              });
            });
            // req.logIn(newUser, (err) => {
            //   if (err) {
            //     return res.status(500).send({ message: 'Internal Server Error' });
            //   }
          });
        } else {
          return res.redirect('/#!/signup?error=existinguser');
        }
      });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

// app.put('/:token', function(req, res){
// app.put('/:token', sendCredentials);
exports.sendCredentials = (req, res) => {
  if (req.params.token) {
    User.findOne(
      {
        temporaryToken: req.params.token
      },
      (err, user) => {
        if (err) throw err;
        const { token } = req.params;
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            res.json({ success: false, message: 'activation link has expired' });
          } else if (!user) {
            res.json({ success: false, message: 'activation link has expired' });
          } else {
            user.temporaryToken = false;
            user.active = true;
            user.save((err) => {
              if (err) {
                return err;
              }
              sendgridgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = {
                to: req.body.email,
                from: 'noreply@asgard_cfh.com',
                subject: 'account activated',
                text: `Hello ${user.name}Your Account has been successfully activated`,
                html: `Hello <strong>${user.name}Your account has been successfully activated`,
              };
              sendgridgMail.send(msg);

              return res.redirect('#!/activationComplete');
            });
          }
        });
      }
    );
  } else {
    return res.status(404).json({ message: 'Token found' });
  }
};


// app.use(function(req, res, next){
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
  return User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    if (user.active !== true) {
      return res.status(401).json({ message: 'You need to confirm your email to activate your account' });
    }
    if (user && bcrypt.compareSync(req.body.password, user.hashed_password)) {
      const {
        _id,
        email
      } = user;
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        _id,
        email
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

