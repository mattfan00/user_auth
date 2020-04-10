import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

import ProtectedPage from './ProtectedPage'
import LoginPage from './LoginPage'

import { loadUser } from './apiCalls/api'

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
      currentUser: null,
      message: null
    }

    this.loadUser = this.loadUser.bind(this)
    this.logout = this.logout.bind(this)
    this.signIn = this.signIn.bind(this)
  }

  componentDidMount() {
    this.loadUser()
  }

  async loadUser() {
    let response = await loadUser()

    if (response.status) {
      this.setState({
        isLoggedIn: false,
        loading: false,
      })
    } else {
      this.setState({
        isLoggedIn: true,
        loading: false,
        currentUser: response,
        error: null
      })
    }
  }

  signIn(result) {
    localStorage.setItem('token', result.token)
    this.setState({ 
      isLoggedIn: true,
      loading: false, 
      currentUser: result.user
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
    const { loading, isLoggedIn, currentUser, error } = this.state
    return ( 
      <div>
        {error}
        { !loading ? 
          <Router>
            <Switch>
              <Route path='/login' render={props => (
                  isLoggedIn
                  ? <Redirect to='/' />
                  : <LoginPage signIn={this.signIn} />
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
  // console.log(rest)
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
