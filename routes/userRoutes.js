const express = require('express');
const userController = require('../controllers/userController');
const {userValidator} = require('../middlewares/validators/userValidator')
const {userTokenAuthentication} = require('../middlewares/authentication/tokenAuthentication')

const router = express.Router();

router.post('/register',userValidator('addUser'), userController.addUser)
router.post('/login',userValidator('login'),userController.login)
router.put('/user',userTokenAuthentication,userValidator('updateUser'),userController.updateUser)
router.delete('/user',userTokenAuthentication,userController.deleteUser)



module.exports = router;





