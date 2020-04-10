var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    config = require('config'),
    jwt = require('jsonwebtoken')

var auth = require('../middleware/auth')

var User = require('../models/user')


// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body

  // Simple validation
  if(!username || !password) {
    return res.status(400).json({message: "Please enter all fields"})
  }

  try {
    // Check if username is used alrady
    let user = await User.findOne({username: username})
    if(user) throw Error('Username is used already')

    // Create new user
    const newUser = User({
      username,
      password
    })

    // Generate salt
    let salt = await bcrypt.genSalt(10)
    if(!salt) throw Error('Salt went wrong')

    // Generate hash
    let hash = await bcrypt.hash(newUser.password, salt)
    if(!hash) throw Error('Hash went wrong')

    // Set password to generated hash
    newUser.password = hash
    let savedUser = await newUser.save()
    if(!savedUser) throw Error('There is an error with saving the user')

    // Generate token for the user using the user id
    let token = jwt.sign({id: savedUser._id}, config.get('jwtSecret'))
    if(!token) throw Error('Something went wrong with generating token')

    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username
      }
    })

  } catch(err) {
    res.status(400).json({message: err.message})
  }
})

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  // Simple validation
  if(!username || !password) {
    return res.json({message: "Please enter all fields"})
  }

  try { 
    // Check if username exists 
    let user = await User.findOne({username: username})
    if(!user) throw Error('User does not exist')

    // Validate password
    let isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw Error('Incorrect password')

    // Generate token
    let token = jwt.sign({id: user._id}, config.get('jwtSecret'))
    if(!token) throw Error('Something went wrong with generating token')

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      }
    })

  } catch(err) {
    res.status(400).json({message: err.message})
  }

})

// Get current user data
router.get('/', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password') // Don't return the password
    if(!user) throw Error('User does not exist')

    res.json(user)
  } catch {
    res.status(400).json({message: err.message})
  }
})


module.exports = router