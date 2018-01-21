const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('quantity _id product')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc.id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
}

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found.'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })
      return order.save()
    })
    .then(result => {
      res.status(201).json({
        message: 'Order stored.',
        createdOrder: {
          _id: result
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

exports.orders_get_order = (req, res, next) => {
  const id = req.params.orderId
  Order.findById(id)
    .populate('product')
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Order not found.'
        })
      }
      res.status(200).json({
        order: doc,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/'
        }
      })
    })
    .catch(err => {
      res.status(404).json({error: err})
    })
}

exports.orders_delete_order = (req, res, next) => {
  Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
      if (result.n == 0) {
        return res.status(404).json({
          message: 'Order not found.'
        })
      }
      res.status(200).json({
        message: 'Order deleted.',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {productId: 'ID', quantity: 'Number'}
        }
      })
    })
    .catch(err => {
      res.status(404).json({error: err})
    })
}
