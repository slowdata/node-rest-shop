const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.users_create_user = async (req, res, next) => {
  try {
    const user = await User.find({email: req.body.email})

    if (user.length > 0) {
      return res.status(409).json({error: 'Email exists already.'})
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          })
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          })
          try {
            const docUser = await user.save()
            if (docUser) {
              console.log(user)
              res.status(201).json({
                message: 'User created'
              })
            }
          } catch (error) {
            console.log(error)
            res.status(500).json(error)
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}

exports.users_login_user = async (req, res, next) => {
  try {
    const _user = await User.find({email: req.body.email})
    if (_user.length < 1) {
      return res.status(401).json({message: 'Auth failed.'})
    }
    bcrypt.compare(req.body.password, _user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({message: 'Auth failed.'})
      }
      if (result) {
        const token = jwt.sign(
          {
            email: _user[0].email,
            userId: _user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: '1h'
          }
        )
        return res.status(200).json({
          message: 'Auth successfull.',
          token: token
        })
      }
      return res.status(401).json({
        message: 'Auth failed.'
      })
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}

exports.users_delete_user = async (req, res, next) => {
  try {
    const deletedUser = await User.remove({_id: req.params.userId}).exec()
    if (deletedUser) {
      res.status(200).json({message: 'User deleted'})
    } else {
      res.status(500).json({error: {message: 'Error deleting user'}})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error})
  }
}

exports.users_get_all_users = async (req, res, next) => {
  try {
    const users = await User.find({})

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}
