import React, { Component } from 'react';
import UserRegister from './UserRegister';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';

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
          key: "Guest",
          name: "Guest",
          admin: false,
          email: "Guest",
          photoUrl: "./img/default.png",
          username: "Guest"
        }

        this.props.setUser(authResult);
      }

      this.setState({ userAuth: authResult })
    });

    window.addEventListener("beforeunload", (ev) => {
      if(this.props.user.key) {
        this.usersRef.child(this.props.user.key).update({
          online: false,
          activeRoom: ""
        });

        this.props.firebase.auth().signOut();
      }
    })
  }

  signInWithPopup() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
    this.setState({ newLogin: true})
  }

  signOut() {
    if(this.props.user.key) {
      this.usersRef.child(this.props.user.key).update({
        online: false,
        activeRoom: ""
      });
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
        <Nav pullRight>
          <NavDropdown title={this.props.user.email} id="basic-nav-dropdown">
          {this.props.user.email !== "Guest" ?
            <MenuItem onClick={() => this.signOut()}>Sign Out</MenuItem>
            :
            <MenuItem onClick={() => this.signInWithPopup()}>Sign In</MenuItem>
          }
          </NavDropdown>
        </Nav>

        <UserRegister
          activeRoom={this.props.activeRoom}
          userAuth={this.state.userAuth}
          newLogin={this.state.newLogin}
          firebase={this.props.firebase}
          handleRegistration={this.handleRegistration}
        />

      </section>
    )
  }
}

export default UserAuth;
