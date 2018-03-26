import React, { Component } from 'react';

class User extends Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user, true);
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
        <h2>{this.props.user}</h2>
        <button
          className="button-sign-in"
          onClick={() => this.signInWithPopup()}>Sign In</button>
        <button
          className="button-sign-in"
          onClick={() => this.signOut()}>Sign Out</button>
      </section>
    )
  }
}

export default User;
