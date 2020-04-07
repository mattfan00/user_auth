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
      loading: true,
      currentUser: null
    }

    this.loadUser = this.loadUser.bind(this)
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    this.loadUser()
  }

  loadUser() {
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

    axios.get('http://localhost:3001/api/auth/user', config)
      .then(res => res.data)
      .then(user => {
        this.setState({
          isLoggedIn: true,
          loading: false,
          currentUser: user
        })
      })
      .catch(err => {
        console.log(err.response.status, err.response.data)
        this.setState({
          isLoggedIn: false,
          loading: false
        })
      })
  }

  login(user) {
    localStorage.setItem('token', user.token)
    this.setState({ 
      isLoggedIn: true,
      loading: false, 
      currentUser: user
    })
  }

  logout() {
    localStorage.removeItem('token')
    this.setState({
      isLoggedIn: false,
      loading: false,
      currentUser: null
    })
  }

  render() {
    const { loading, isLoggedIn, currentUser } = this.state
    return ( 
      <div>
        { !loading ? 
          <Router>
            <Switch>
              {/* <Route path='/login'>
                <LoginPage login={this.login} />
              </Route> */}
              <Route path='/login' render={props => (
                  isLoggedIn
                  ? <Redirect to='/' />
                  : <LoginPage login={this.login} />
                )} 
              />
              <PrivateRoute path='/' isLoggedIn={isLoggedIn} user={currentUser} logout={this.logout} component={ProtectedPage} />
            </Switch>
        </Router> 
          : '' }
      </div>
      
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  console.log(rest)
  return (
    <Route {...rest} render={props => (
      rest.isLoggedIn 
        ? <Component {...props} user={rest.user} logout={rest.logout} />
        : <Redirect to='/login' />
      )}
    />
  )
}

export default App;
