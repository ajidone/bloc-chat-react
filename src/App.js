import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import UserAuth from './components/User/UserAuth';
import UserList from './components/User/UserList';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmxchtexfda4Ky6vwrC4gc0FjYvhMTlBw",
  authDomain: "bloc-chat-react-650ed.firebaseapp.com",
  databaseURL: "https://bloc-chat-react-650ed.firebaseio.com",
  projectId: "bloc-chat-react-650ed",
  storageBucket: "bloc-chat-react-650ed.appspot.com",
  messagingSenderId: "479271708200"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRoom: {key: null, name: null},
      user: { name: "Guest", email: "Guest", admin: false, photoUrl: "./img/default.png"}
    }
  }

  setUser = (userData) => {
    this.setState({ user: userData});
  }

  handleRoomSelect = (e) => {
    const activeRoomKey = e.target.getAttribute('roomkey');
    const activeRoomName = e.target.getAttribute('roomname');
    const activeRoom = {
      key: activeRoomKey,
      name: activeRoomName
    }

    this.setState({ activeRoom: activeRoom });
  }

  render() {
    return (
      <div className="App">

      <UserAuth
        firebase={firebase}
        activeRoom={this.state.activeRoom}
        user={this.state.user}
        setUser={this.setUser}
      />
      <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
          handleRoomSelect={this.handleRoomSelect}
        />
        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
        />
        <UserList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
        />
      </div>
    );
  }
}

export default App;
