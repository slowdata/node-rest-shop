const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select('quantity _id product')
      .populate('product', 'name')
      .exec()
    if (orders) {
      res.status(200).json({
        count: orders.length,
        orders: orders.map(doc => {
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
    }
  } catch (error) {
    console.log(err)
    res.status(500).json({error: err})
  }
}

exports.orders_create_order = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId).exec()
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
    const _order = await order.save()
    if (!_order) {
      return res.status(500).json({
        error: 'Error creating order.'
      })
    }
    res.status(201).json({
      message: 'Order stored.',
      createdOrder: {
        _id: _order._id
      },
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/' + _order._id
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({error: err})
  }
}

exports.orders_get_order = async (req, res, next) => {
  const id = req.params.orderId
  try {
    const order = await Order.findById(id)
      .populate('product')
      .exec()
    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      })
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/'
      }
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({error: err})
  }
}

exports.orders_delete_order = async (req, res, next) => {
  try {
    const order = await Order.remove({_id: req.params.orderId}).exec()
    console.log(order)
    if (order.n === 0) {
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
  } catch (err) {
    console.log(err)
    res.status(500).json({error: err})
  }
}
