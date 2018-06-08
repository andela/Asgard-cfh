const { check, validationResult } = require('express-validator/check');
/**
 * @description - Validate user signup
 * @param {object} req - request body
 * @param {object} res - response body
 *
 * @return {undefined} depends on user input
 */
exports.validateSignup = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

 exports.signupChecks = [check('email', 'please enter a valid email')
        .isEmail(),
        check('name', 'name must be a minimum of two letters')
        .trim()
        .isLength({ min: 2 }),
        check('password', 'passwords must be at least 6 chars long and contain one number')
        .isLength({ min: 6 })
        .matches(/\d/)];