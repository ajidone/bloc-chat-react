import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import logo from './assets/logo.png'

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
      user: {username: "Guest", name: "Guest", admin: false}
    }
  }

  setUser(user, login) {
    if(user && login) {
      this.setState({
        user: user
      });

    } else {
      this.setState({ user: {username: "Guest", name: "Guest", admin: false} });
    }
  }

  handleRoomSelect(e) {
    const activeRoomKey = e.target.id.replace("name","");

    this.setState({ activeRoom: activeRoomKey });
  }

  render() {
    return (
      <div className="App">
        <header>
          <div className="flex-header">
            <div className="flex-logo">
              <img src= { logo } alt="logo" />
            </div>
            <span className="header-spacer"><h1>Bloc Chat</h1></span>
            <span className="header-user">{this.state.user.name}</span>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="sidebar-left">
            <RoomList
              firebase={firebase}
              user={this.state.user}
              activeRoom={this.state.activeRoom}
              handleRoomSelect={(e) => this.handleRoomSelect(e)}
            />
          </div>

          <main id="message-container">
            <MessageList
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
              handleTyping={(type) => this.handleTyping(type)}
            />
          </main>

          <div className="sidebar-right">
            <User
              firebase={firebase}
              user={this.state.user}
              activeRoom={this.state.activeRoom}
              setUser={(user, login) => this.setUser(user, login)}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
