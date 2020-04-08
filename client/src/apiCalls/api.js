import axios from 'axios'


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

  return axios.post('http://localhost:3001/api/auth/', body, config)
    .then(res => res.data)
}
