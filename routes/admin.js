/*BEFORE LOGIN OR REGISTER*/

const express = require('express');
const router = express.Router();
const admin_ctrl = require('../controllers/admin_ctrl');

router.get('/',admin_ctrl.admin_get);
router.get('/profil', admin_ctrl.profil_get);






module.exports = router;