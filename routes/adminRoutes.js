const express = require('express');
const adminController = require('../controllers/adminController');
const {adminTokenAuthentication} = require('../middlewares/authentication/tokenAuthentication')

const router = express.Router();

router.get('/users', adminTokenAuthentication,adminController.getAllUsers)


module.exports = router;





