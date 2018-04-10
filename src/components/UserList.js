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

  render() {
    return (
      <div>
  			<ul>
        {this.state.users.map ( (user, index) =>
          <li id={user.key} key={index}>{user.name}</li>
        )}
  			</ul>
      </div>

    )
  }
}

export default UserList;
