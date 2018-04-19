import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      filterOn: false,
      showAll: true
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
        photoUrl: snapshot.val().photoUrl,
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
        photoUrl: snapshot.val().photoUrl,
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

    if(deleteUserKey & this.props.user.key !== deleteUserKey) {
      this.usersRef.child(deleteUserKey).remove()
    } else {
      window.alert("Please request an admin to delete your account");
    }
  }

  handleFilter = (e) => {
    const filter = e.target.checked;
    if(filter){
      this.setState({
        filterOn: e.target.checked,
        showAll: false
      })
    } else {
      this.setState({
        filterOn: e.target.checked,
        showAll: true
      })
    }
  }

  render() {
    return (
      <section className="section-user-list">
      <Panel.Heading>
        <Panel.Title componentClass="h3" toggle>User List</Panel.Title>
      </Panel.Heading>
      <Panel.Collapse>
        <Panel.Body>
          <div className="filter-users">
            <label htmlFor="filter-users-checkbox" id="filter-users-checkbox-label">
              <input type="checkbox"
                id="filter-users-checkbox"
                onChange={this.handleFilter}
                checked={this.state.filterOn}
              />
              Show Active Room Participants Only
            </label>
          </div>
          <ul className="user-list">
            {this.state.users
              .filter(usr =>
                (usr.online === this.state.filterOn
                && usr.activeRoom === this.props.activeRoom.key)
                || this.state.showAll)
              .map( (user, index) =>
                <li id={user.key} key={index} className={user.activeRoom === this.props.activeRoom ? "active-user" : "inactive-user"}>
                  <span className="user-list-name">
                    <span className={user.online ? "fas fa-circle" : "far fa-circle"} />
                    <img className="user-picture" src={user.photoUrl} alt="userPicture" />
                    {user.username}
                  </span>

                  { ((user.email === this.props.user.email && this.props.user.email !== "Guest") ||
                    this.props.user.admin) &&
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
                  }
                </li>
              )}
          </ul>
          </Panel.Body>
        </Panel.Collapse>
      </section>
    )
  }
}

export default UserList;
