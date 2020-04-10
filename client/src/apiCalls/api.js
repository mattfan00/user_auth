import axios from 'axios'

export async function loadUser() { 
  var currentToken = localStorage.getItem('token')

  // headers
  var config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  // If token, add to headers
  if(currentToken) {
    config.headers['x-auth-token'] = currentToken
  }

  return axios.get('http://localhost:3001/api/users', config)
    .then(res => res.data)
    .catch(err => err.response)
}

export async function login(username, password) {
  // headers
  var config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  var body = JSON.stringify({
    username,
    password
  })

  return axios.post('http://localhost:3001/api/users/login', body, config)
    .then(res => res.data)
    .catch(err => err.response.data)
}

export async function register(username, password) {
  // headers
  var config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  var body = JSON.stringify({
    username,
    password
  })

  return axios.post('http://localhost:3001/api/users/register', body, config)
    .then(res => res.data)
    .catch(err => err.response)
}