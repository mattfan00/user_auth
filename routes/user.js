var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    config = require('config'),
    jwt = require('jsonwebtoken')

var User = require('../models/user')


// Register new user
router.post('/', (req, res) => {
  const { username, password } = req.body

  // Simple validation
  if(!username || !password) {
    return res.status(400).json({message: "Please enter all fields"})
  }

  User.findOne({username: username})
    .then(user => {
      if(user) return res.status(400).json({message: 'User already exists'})

      const newUser = User({
        username,
        password
      })

      // Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err
          newUser.password = hash
          newUser.save()
            .then(user => {
              jwt.sign({id: user._id}, config.get('jwtSecret'), (err, token) => {
                if(err) throw err
                res.json({
                  token,
                  user: {
                    id: user._id,
                    username: user.username,
                  }
                })
              })
            })
        })
      })
    })
})

module.exports = router