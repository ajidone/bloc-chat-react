import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';

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
      activeRoom: null,
      user: "Guest"
    }
  }

  setUser(authResult, login) {
    if(authResult && login) {
      const user = authResult.displayName;
      this.setState({ user: user});
    } else {
      this.setState({ user: "Guest" });
    }
  }

  handleRoomSelect(e) {
    const activeRoomKey = e.target.id;
    this.setState({ activeRoom: activeRoomKey });
  }

  render() {
    return (
      <div className="App">
      <User
        firebase={firebase}
        user={this.state.user}
        setUser={(authResult, login) => this.setUser(authResult, login)}
      />
      <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          handleRoomSelect={(e) => this.handleRoomSelect(e)}
        />
        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
        />
      </div>
    );
  }
}

export default App;
