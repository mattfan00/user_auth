import React, { Component } from 'react'
import { login, register } from './apiCalls/api'

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loginUsername: '',
      loginPassword: '',
      regUsername: '',
      regPassword: ''
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginUsername = this.handleLoginUsername.bind(this)
    this.handleLoginPassword = this.handleLoginPassword.bind(this)

    this.handleReg = this.handleReg.bind(this)
    this.handleRegUsername = this.handleRegUsername.bind(this)
    this.handleRegPassword = this.handleRegPassword.bind(this)
  }

  

  async handleLogin(e) {
    e.preventDefault()

    let result = await login(this.state.loginUsername, this.state.loginPassword)
    this.setState({
      loginUsername: '',
      loginPassword: '',
      regUsername: '',
      regPassword: ''
    })
    this.props.signIn(result)
  }

  handleLoginUsername(e) {
    const loginUsername = e.target.value
    this.setState({ loginUsername })
  }

  handleLoginPassword(e) {
    const loginPassword = e.target.value
    this.setState({ loginPassword })
  }


  async handleReg(e) {
    e.preventDefault()

    let result = await register(this.state.regUsername, this.state.regPassword)
    this.setState({
      loginUsername: '',
      loginPassword: '',
      regUsername: '',
      regPassword: ''
    })
    this.props.signIn(result)
  }

  handleRegUsername(e) {
    const regUsername = e.target.value
    this.setState({ regUsername })
  }

  handleRegPassword(e) {
    const regPassword = e.target.value
    this.setState({ regPassword })
  }



  render() {
    const { loginUsername, loginPassword, regUsername, regPassword } = this.state
    return (
      <div>
        <div>
          <h3>Login</h3>
          <form onSubmit={this.handleLogin}>
            <input value={loginUsername} onChange={this.handleLoginUsername}></input>
            <input value={loginPassword} type="password" onChange={this.handleLoginPassword}></input>
            <button>Login</button> 
          </form>
        </div>
        <div>
          <h3>Register</h3>
          <form onSubmit={this.handleReg}>
            <input value={regUsername} onChange={this.handleRegUsername}></input>
            <input value={regPassword} type="password" onChange={this.handleRegPassword}></input>
            <button>Login</button> 
          </form>
        </div>
      </div>
      
    )
  }
}

export default LoginPage