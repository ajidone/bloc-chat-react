import React, { Component } from 'react';

class UserRegister extends Component {
  componentWillReceiveProps(newProps) {
    if(newProps.userAuth !== this.props.userAuth) {
      const usersRef = this.props.firebase.database().ref('users');

      let userData = {};
      const newUser = newProps.userAuth;
      if(newUser.email !== "Guest" && this.props.newLogin) {
      usersRef
        .orderByChild("email")
        .equalTo(newUser.email)
        .on("value", snapshot => {
          if(snapshot.val()) {
            const userKey = Object.keys(snapshot.val())[0]
            const user = snapshot.val()[userKey];
            userData = {
              key: userKey,
              name: user.name,
              admin: user.admin,
              email: user.email,
              username: user.username,
              online: user.online,
              activeRoom: user.activeRoom
            }

            this.props.handleRegistration(userData, false);
          } else if (this.props.newLogin){
            userData = {
              name: newUser.displayName,
              admin: true,
              email: newUser.email,
              username: newUser.displayName,
              online: true,
              createdTs: this.props.firebase.database.ServerValue.TIMESTAMP
            }

            this.props.handleRegistration(userData, true);
          }
        });
      }
    }
  }



  render() {
    return (
      <section className="user-register">
      <button
        className="button-register">Register</button>
      </section>
    )
  }
}

export default UserRegister;
