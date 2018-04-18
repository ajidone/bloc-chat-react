import React, { Component } from 'react';
import UserRegister from './UserRegister';

class UserAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: {},
      newLogin: false
    }

    this.usersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( authResult => {
      if(!authResult) {
        authResult = {
          name: "Guest",
          admin: false,
          email: "Guest",
          username: "Guest"
        }
      }
      console.log(authResult)

      this.setState({ userAuth: authResult })
      this.props.setUser(authResult);
    });
  }

  signInWithPopup() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
    this.setState({ newLogin: true})
  }

  signOut() {
    this.props.firebase.auth().signOut();
    this.setState({ newLogin: false})
  }

  handleRegistration = (userData, newUser) => {
    if(newUser) {
      const newUserRef = this.usersRef.push(userData);
      userData.key = newUserRef.key;
    }

    this.setState({ newLogin: false })
    this.props.setUser(userData);
  }

  render() {
    return (
      <section className="user-login">
        <div className="active-user">
          <strong>{this.props.user.email}</strong>
        </div>
          <button
            className="button-sign-in"
            onClick={() => this.signInWithPopup()}>Sign In</button>
          <button
            className="button-sign-out"
            onClick={() => this.signOut()}>Sign Out</button>
          <UserRegister
            activeRoom={this.props.activeRoom}
            userAuth={this.state.userAuth}
            newLogin = {this.state.newLogin}
            firebase={this.props.firebase}
            handleRegistration={this.handleRegistration}
          />

      </section>
    )
  }
}

export default UserAuth;
