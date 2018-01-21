const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/userController')

router.post('/signup', UserController.users_create_user)

router.post('/login', UserController.users_login_user)

router.delete('/:userId', checkAuth, UserController.users_delete_user)

// APenas par DEV
//router.get('/list', checkAuth, UserController.users_get_all_users)

module.exports = router
