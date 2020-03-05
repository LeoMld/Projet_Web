/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const home_ctrl = require('../controllers/home_ctrl');

router.get('/', home_ctrl.home_connexion_get);
router.post('/', home_ctrl.home_connexion_post);

router.get('/register', home_ctrl.home_register_get);
router.post('/register',home_ctrl.home_register_post);
router.get('/register/verify',home_ctrl.verify_get);
router.put('/register/verify',home_ctrl.verify_put);

router.get('/contact', home_ctrl.home_contact_get);

router.get('/logout',home_ctrl.logout);

router.post('/contact',home_ctrl.send_mail_contact);




module.exports = router;
