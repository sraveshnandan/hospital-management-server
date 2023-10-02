const { check, validationResult } = require('express-validator');

const validate= ()=>{
  check('username').notEmpty().withMessage('username is required.'),
  check('email').notEmpty().withMessage('email is required.'),
  check('password').notEmpty().withMessage('password is required.')
}