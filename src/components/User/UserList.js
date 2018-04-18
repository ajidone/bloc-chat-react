import React, { Component } from 'react';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };

    this.usersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.usersRef.on('child_added', snapshot => {
      let newUser = {
        key: snapshot.key,
        name: snapshot.val().name,
        admin: snapshot.val().admin,
        email: snapshot.val().email,
        username: snapshot.val().username,
        online: snapshot.val().online,
        activeRoom: snapshot.val().activeRoom
      };

       this.setState({ users: this.state.users.concat( newUser ) });
    });

    this.usersRef.on('child_changed', snapshot => {
      let updatedUser = {
        key: snapshot.key,
        name: snapshot.val().name,
        admin: snapshot.val().admin,
        email: snapshot.val().email,
        username: snapshot.val().username,
        online: snapshot.val().online,
        activeRoom: snapshot.val().activeRoom
      };

      this.setState({ users: this.state.users.map( user => user.key === snapshot.key ?
        user = updatedUser : user)
      });
    });

    this.usersRef.on('child_removed', snapshot => {
      this.setState({ users: this.state.users.filter( user => user.key !== snapshot.key ) });
    });
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
      <section className="section-user-list">
        <ul>
          {this.state.users.map ( (user, index) =>
            <li id={user.key} key={index} className={user.activeRoom === this.props.activeRoom ? "active-user" : "inactive-user"}>
              <span className="user-list-name">
                <span className={user.online ? "fas fa-circle" : "far fa-circle"} />
                {user.username +"  "}
              </span>

              <span className="user-buttons">
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
              </span>
            </li>
          )}
        </ul>
      </section>
    )
  }
}

export default UserList;
