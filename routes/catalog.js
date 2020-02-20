var express = require('express');
var router = express.Router();

// Require controller modules.
var test = require('../controllers/test');

router.get('/test', test.index);

module.exports = router;