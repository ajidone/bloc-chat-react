import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: []
    }

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) });
     });
   }

   createNewRoom = (e) => {
     e.preventDefault();
     const newRoomName = document.getElementById("newRoomName").value;

     if(newRoomName) {
       this.roomsRef.push({
         name: newRoomName
       })
     }
   }

  render() {
    return (
      <div>
        <ol>
        {this.state.rooms.map( (room, index) =>
          <li id={room.key} key={room.key} onClick={this.props.handleRoomSelect}>{room.key + "   " + room.name}</li>
        )}
        </ol>

        <form>
          <label htmlFor="newRoomName" className="input-label" id="newRoomNameLabel">New Room Name: </label>
          <input type="text" className="input-roomname" id="newRoomName" />
          <input type="submit"
            className="submit-button"
            id="newRoomSubmit"
            onClick={this.createNewRoom}
          />
        </form>
      </div>

    );
  }
}

export default RoomList;
