import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

import ProtectedPage from './ProtectedPage'
import LoginPage from './LoginPage'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      loading: true
    }

    this.getToken = this.getToken.bind(this)
  }

  componentDidMount() {
    this.getToken()
    
  }

  getToken() {
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
        console.log(res.data)
        this.setState({
          isLoggedIn: res.data.token,
          loading: false
        })
      })
  }

  render() {
    const { loading, isLoggedIn } = this.state
    return ( 
      <div>
        { !loading ? 
          <Router>
            <Switch>
              <Route path='/login' component={LoginPage} />
              <PrivateRoute path='/' isLoggedIn={isLoggedIn} component={ProtectedPage} />
            </Switch>
        </Router> 
          : '' }
      </div>
      
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => (
      rest.isLoggedIn 
        ? <Component {...props} />
        : <Redirect to='/login' />
      )}
    />
  )
}

export default App;
