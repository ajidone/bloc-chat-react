import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);

    this.usersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user, true);

      this.usersRef.on('value', snapshot => {
        //keeps erroring on sign out because user is empty on auth state changed
        snapshot.forEach( usr => {
        /*  if(usr.val().email === user.email) {
            console.log("true");
          }*/console.log(1);
        });

      });
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
      <section className="section-user">
        <p>{this.props.user}</p>
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
    )
  }
}

export default User;
