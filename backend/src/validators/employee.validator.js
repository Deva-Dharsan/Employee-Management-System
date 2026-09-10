const { body, validationResult } = require('express-validator');

const commonRules = [
  body('employeeName')
    .trim()
    .notEmpty().withMessage('Employee name is required.')
    .isLength({ min: 3 }).withMessage('Employee name must be at least 3 characters.')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Employee name can only contain letters and spaces.'),

  body('emailId')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .matches(/^[a-zA-Z0-9._%+\-]+@gmail\.com$/).withMessage('Enter a valid Gmail address (e.g. name@gmail.com).'),

  body('contactNo')
    .trim()
    .notEmpty().withMessage('Contact number is required.')
    .matches(/^[6-9][0-9]{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.'),

  body('gender')
    .notEmpty().withMessage('Gender is required.')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other.'),

  body('role')
    .trim()
    .notEmpty().withMessage('Role is required.')
    .isLength({ min: 2 }).withMessage('Role must be at least 2 characters.'),

  body('deptId')
    .notEmpty().withMessage('Department is required.'),
];

const validateCreateEmployee = [
  ...commonRules,
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).withMessage('Password must contain at least one letter and one number.'),
];

const validateUpdateEmployee = [
  ...commonRules,
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).withMessage('Password must contain at least one letter and one number.'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(e => e.msg).join(' | ');
    return res.status(422).json({
      result: false,
      message: `Validation failed: ${message}`,
      data: null,
    });
  }
  next();
};

module.exports = {
  validateCreateEmployee: [...validateCreateEmployee, handleValidationErrors],
  validateUpdateEmployee: [...validateUpdateEmployee, handleValidationErrors],
};
