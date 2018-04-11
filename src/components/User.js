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
    this.usersRef.on('value', snapshot => {
      const userList = [];

      snapshot.forEach( usr => {
        userList.push({
          key: usr.key,
          name: usr.val().name,
          admin: usr.val().admin,
          email: usr.val().email,
          username: usr.val().username,
          online: usr.val().online,
          activeRoom: usr.val().activeRoom
        });
      });

      this.setState({ users: userList});
    });

    this.props.firebase.auth().onAuthStateChanged( user => {
      if(user) {
        const userInfo = {
                admin: false,
                email: user.email,
                name: user.displayName,
                username: user.displayName,
                online: true,
                activeRoom: this.props.activeRoom
              };

        this.props.setUser(userInfo, true);
       }
    });

    window.addEventListener("beforeunload", (ev) =>
    {
      const signOutUser = {
          online: false,
          activeRoom: ""
        };

      this.usersRef.child(this.props.user.key).update(signOutUser);
      this.props.firebase.auth().signOut();
      this.props.setUser(null, false);
    });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.user.email !== this.props.user.email &&
        newProps.user.username !== "Guest" &&
        this.state.users.length > 0) {

      const userInfo = this.state.users.find( usr => usr.email === newProps.user.email);

      if(userInfo) {
        this.usersRef.child(userInfo.key).update({ online: true, activeRoom: this.props.activeRoom });
        this.props.setUser(userInfo, true);

      } else {
        const newUser = {
            admin: true,
            createdTs: this.props.firebase.database.ServerValue.TIMESTAMP,
            lastLoginTs: this.props.firebase.database.ServerValue.TIMESTAMP,
            email: newProps.user.email,
            name: newProps.user.name,
            username: newProps.user.username,
            online: true,
            activeRoom: this.props.activeRoom
          };

        const newUserRef = this.usersRef.push(newUser);
        newUser.key = newUserRef.key;

        this.props.setUser(newUser, true);
      }
    }

    if((newProps.activeRoom !== this.props.activeRoom) && this.props.user.name !== "Guest") {
      this.usersRef.child(this.props.user.key).update({ activeRoom: this.props.activeRoom });
    }
  }

  signInWithPopup() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  signOut() {
    const signOutUser = {
        online: false,
        activeRoom: ""
      };

    if(this.props.user.key) {
      this.usersRef.child(this.props.user.key).update(signOutUser);
    }

    this.props.firebase.auth().signOut();
    this.props.setUser(null, false);
  }

  updateUser = (e) => {
    const updateUserKey = e.target.parentNode.id.replace("update","");

    const updateUsername = window.prompt("Please enter a new username:");
    if(this.props.user.admin) {
      const updateAdmin = window.prompt("Admin? (please type 'true' or 'false')");
      this.usersRef.child(updateUserKey).update({
        username: updateUsername,
        admin: updateAdmin
      });
    } else {
      this.usersRef.child(updateUserKey).update({username: updateUsername});
    }
}

deleteUser = (e) => {
  const deleteUserKey = e.target.parentNode.id.replace("delete","");

  if(deleteUserKey) {
    this.usersRef.child(deleteUserKey).remove()
  }
}

  render() {
    return (
      <section className="user">
        <section className="user-login">
          <div className="active-user">
            <strong>{this.props.user.username}</strong>
          </div>
          {
            this.props.user.username === "Guest" ?
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

              <li className="show-all-users-li">
                <label htmlFor="show-all-check" id="show-all-label">Show all users?</label>
                <input type="checkbox" id="show-all-check"/>
              </li>

            {this.state.users.map ( (user, index) =>
              <li id={user.key} key={index} className={user.activeRoom === this.props.activeRoom ? "active-user" : "inactive-user"}>
                <div className="user-list-name">
                  <span className={user.online ? "fas fa-circle" : "far fa-circle"} />
                  {user.username}
                </div>

                { ((user.key === this.props.user.key || this.props.user.admin === true) ||
                  this.props.user.admin) &&
                    <div className="user-buttons">
                      <button
                        id={"update" + user.key}
                        className="update-button"
                        onClick={this.updateUser}
                      ><span className="far fa-edit" /></button>
                      <button
                        id={"delete" + user.key}
                        className="delete-button"
                        onClick={this.deleteUser}
                      ><span className="far fa-trash-alt" /></button>
                    </div>
                }

              </li>
            )}
      			</ul>
        </section>
      </section>
    )
  }
}

export default User;
