import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };

    this.usersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user, true);
    });

    this.usersRef.on('value', snapshot => {
      const userList = [];

      snapshot.forEach( usr => {
        userList.push({
          key: usr.key,
          name: usr.val().name,
          admin: usr.val().admin,
          email: usr.val().email,
          username: usr.val().username
        });
      });

      this.setState({ users: userList});
    });
  }

  signInWithPopup() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  signOut() {
    this.props.firebase.auth().signOut();
    this.props.setUser(null, false);
  }

  render() {
    return (
      <section className="user">
        <section className="user-login">
          <div className="active-user">
            <strong>{this.props.user}</strong>
          </div>
          {
            this.props.user === "Guest" ?
            <button
              className="button-sign-in"
              onClick={() => this.signInWithPopup()}>Sign In</button>
            :
            <button
              className="button-sign-out"
              onClick={() => this.signOut()}>Sign Out</button>
            }
        </section>
        <section className="user-list">
      			<ul>
            {this.state.users.map ( (user, index) =>
              <li id={user.key} key={index}>
                {user.name}
              </li>
            )}
      			</ul>
        </section>
      </section>
    )
  }
}

export default User;
