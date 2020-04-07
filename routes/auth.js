var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    config = require('config'),
    jwt = require('jsonwebtoken'),
    auth = require('../middleware/auth')

var User = require('../models/user')

// Authenticate user
router.post('/', (req, res) => {
  const { username, password } = req.body

  if(!username || !password) {
    return res.json({message: "Please enter all fields"})
  }

  User.findOne({username: username})
    .then(user => {
      if(!user) return res.json({message: 'User does not exist'})

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.json({message: "Invalid credentials"})

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

// Get user data
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password') // Don't return the password
    .then(user => {
      res.json(user)
    })
})

module.exports = router