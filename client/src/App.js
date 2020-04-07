import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
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

    axios.get('http://localhost:3001/api/auth/user')
      .then(res => {
        console.log(res.data.message)
      })
  }

  render() {
    return ( 
      <div>
        this is the react app
      </div>
    )
  }
}

export default App;
