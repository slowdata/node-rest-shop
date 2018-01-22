const express = require('express')

const checkAuth = require('../middleware/check-auth')

const ordersConstroller = require('../controllers/ordersController')

const router = express.Router()

router.get('/', checkAuth, ordersConstroller.orders_get_all)

router.post('/', checkAuth, ordersConstroller.orders_create_order)

router.get('/:orderId', checkAuth, ordersConstroller.orders_get_order)

router.delete('/:orderId', checkAuth, ordersConstroller.orders_delete_order)

module.exports = router
