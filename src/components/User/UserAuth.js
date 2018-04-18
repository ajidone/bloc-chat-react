import React, { Component } from 'react';
import UserRegister from './UserRegister';

class UserAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: {},
      newLogin: true
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

        this.props.setUser(authResult);
      }

      this.setState({ userAuth: authResult })
    });
  }

  signInWithPopup() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
    this.setState({ newLogin: true})
  }

  signOut() {
    if(this.props.user.key) {
      this.usersRef.child(this.props.user.key).update({online: false});
    }

    this.props.firebase.auth().signOut();
  }

  handleRegistration = (userData, newUser) => {
    if(newUser) {
      const newUserRef = this.usersRef.push(userData);
      userData.key = newUserRef.key;
    }

    if(userData.key && this.state.newLogin) {
      this.usersRef.child(userData.key).update({online: true});
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
