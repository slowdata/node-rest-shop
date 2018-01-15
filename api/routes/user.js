const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email })

    if (user.length > 0) {
      return res.status(409).json({ error: "Email exists already." });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          try {
            const docUser = await user.save()
            if (docUser) {
              console.log(user);
              res.status(201).json({
                message: "User created"
              });
            }

          } catch (error) {
            console.log(error);
            res.status(500).json(error);

          }
        }
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error
    });
  }


  // User.find({ email: req.body.email })
  //   .exec()
  //   .then(user => {
  //     if (user.length >= 1) {
  //       return res.status(409).json({ error: "Email exists already." });
  //     } else {
  //       bcrypt.hash(req.body.password, 10, (err, hash) => {
  //         if (err) {
  //           return res.status(500).json({
  //             error: err
  //           });
  //         } else {
  //           const user = new User({
  //             _id: new mongoose.Types.ObjectId(),
  //             email: req.body.email,
  //             password: hash
  //           });
  //           user
  //             .save()
  //             .then(user => {
  //               console.log(user);
  //               res.status(201).json({
  //                 message: "User created"
  //               });
  //             })
  //             .catch(err => {
  //               console.log(err);
  //               res.status(500).json({
  //                 error: err
  //               });
  //             });
  //         }
  //       });
  //     }
  //   })
  //   .catch();
});

router.delete('/:userId', async (req, res, next) => {
  try {
    const deletedUser = await User.remove({ _id: req.params.userId }).exec()
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted' })
    } else {
      res.status(500).json({ error: { message: 'Error deleting user' } })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })

  }

})


router.get('/list', async (req, res, next) => {
  try {
    const users = await User.find({})

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})



module.exports = router;
