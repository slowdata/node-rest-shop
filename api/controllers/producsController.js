const mongoose = require('mongoose')

const Product = require('../models/product')

exports.products_get_all = async (req, res, next) => {
  try {
    const products = await Product.find()
      .select('name price _id productImage')
      .exec()

    if (!products) {
      return Response.status(404).send({error: 'Nor found.'})
    }
    const response = {
      count: products.length,
      product: products.map(product => {
        return {
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          _id: product._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${product._id}`
          }
        }
      })
    }
    res.status(200).send(response)
  } catch (error) {
    console.log(error)
    res.status(500).send({error: error})
  }
}

exports.products_create_product = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  try {
    const _product = await product.save()
    if (!_product) {
      return Response.status(500).send({error: 'Error creating product.'})
    }
    res.status(201).json({
      message: 'Created product succesfully',
      createdProduct: {
        name: _product.name,
        price: _product.price,
        _id: _product._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${_product._id}`
        }
      }
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({error: err})
  }
}

exports.products_get_product = async (req, res, next) => {
  const id = req.params.productId
  try {
    const product = await Product.findById(id)
      .select('name price _id productImage')
      .exec()
    if (!product) {
      return Response.status(404).json({error: 'Product not found.'})
    }
    res.status(200).json({
      product: product,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products'
      }
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({error: err})
  }
}

exports.products_update_product = async (req, res, next) => {
  const id = req.params.productId
  try {
    const updateOps = {}
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value
    }
    const result = await Product.update({_id: id}, {$set: updateOps}).exec()
    if (!result) {
      return res.status(500).send({error: 'Error updating product.'})
    }
    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + result._id
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error})
  }
}

exports.products_delete_product = async (req, res, next) => {
  const id = req.params.productId
  try {
    const product = await Product.remove({_id: id}).exec()
    if (product.n === 0) {
      res.status(404).send({error: 'Product not found.'})
    }
    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products/',
        body: {name: 'String', price: 'Number'}
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({error: error})
  }
}
