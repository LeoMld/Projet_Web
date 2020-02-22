/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const home_ctrl = require('../controllers/home_ctrl');
/* GET home page. */
/*router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});*/

router.get('/', home_ctrl.home_connexion_get);

router.get('/register', home_ctrl.home_register_get);
router.post('/register',home_ctrl.home_register_post);

router.get('/contact', home_ctrl.home_contact_get);



module.exports = router;
