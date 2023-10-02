const router = require('express').Router();
const { testFunction } = require('../controllers/testFunction');
router.route('/test').get(testFunction)
module.exports= router;