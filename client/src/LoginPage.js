import React, { Component } from 'react'
import { login } from './apiCalls/api'

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
  }

  

  async handleSubmit(e) {
    e.preventDefault()

    let result = await login(this.state.username, this.state.password)
    this.setState({
      username: '',
      password: ''
    })
    this.props.login(result)
  }

  handleUsername(e) {
    const username = e.target.value
    this.setState({ username })
  }

  handlePassword(e) {
    const password = e.target.value
    this.setState({ password })
  }



  render() {
    const { username, password } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={username} onChange={this.handleUsername}></input>
        <input value={password} type="password" onChange={this.handlePassword}></input>
        <button>Submit</button> 
      </form>
    )
  }
}

export default LoginPage