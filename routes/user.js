var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    config = require('config'),
    jwt = require('jsonwebtoken')

var auth = require('../middleware/auth')

var User = require('../models/user')


// Register new user
router.post('/register', (req, res) => {
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
          if(err) console.log(err)
          newUser.password = hash
          newUser.save()
            .then(user => {
              jwt.sign({id: user._id}, config.get('jwtSecret'), (err, token) => {
                if(err) console.log(err)
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

// Login user
router.post('/login', (req, res) => {
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

// Get current user data
router.get('/', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password') // Don't return the password
    .then(user => {
      res.json(user)
    })
})


module.exports = router