import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import UserAuth from './components/User/UserAuth';
import UserList from './components/User/UserList';
import { Grid, Col, Navbar, Panel, Alert } from 'react-bootstrap';

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
      user: { key: "Guest", name: "Guest", email: "Guest", admin: false, photoUrl: "./img/default.png"}
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

    this.state.user.email !== "Guest" &&
      firebase.database()
        .ref('users')
        .child(this.state.user.key)
        .update({
          activeRoom: activeRoom.key
        });

    this.setState({ activeRoom: activeRoom });
  }

  render() {
    return (
      <Grid className="App">

          <div className="navbar navbar-default navbar-fluid navbar-static-top">
            <Navbar.Header>
              <Navbar.Brand className="brand">
                Bloc Chat
              </Navbar.Brand>
            </Navbar.Header>
            <UserAuth
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
              setUser={this.setUser}
            />
          </div>

        <Col sm={4} lg={3} className="room-user-col">
          <Panel>
            <RoomList
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
              handleRoomSelect={this.handleRoomSelect}
            />
          </Panel>

          <Panel>
            <UserList
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
            />
          </Panel>
        </Col>

        {!this.state.activeRoom.key &&
          <Col sm={8} lg={6} className="alert-col">
          <Alert>Please select a chat room</Alert>
          </Col>
        }
        {this.state.activeRoom.key &&
          <Col sm={8} lg={6} className="message-col">
            <Panel className="message-panel">
              <MessageList
                firebase={firebase}
                activeRoom={this.state.activeRoom}
                user={this.state.user}
              />
            </Panel>
          </Col>
        }


      </Grid>
    );
  }
}

export default App;
