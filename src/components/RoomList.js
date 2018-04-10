import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      newRoomName: null
    }

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
     this.roomsRef.on('value', snapshot => {
       const roomList = [];

       snapshot.forEach( room => {
         roomList.push({
           key: room.key,
           name: room.val().name
         });
       });

      this.setState({ rooms: roomList });
     });
   }


   createNewRoom = (e) => {
     e.preventDefault();
     const newRoomName = document.getElementById('newRoomName').value;

     (newRoomName ?
       this.roomsRef.push({
         name: newRoomName
       })
     :
       alert("Please enter a room name!")
     );

     document.getElementById('newRoomName').value = "";
   }

   updateRoom = (e) => {
     const updateRoomKey = document.getElementById(e.target.id).parentNode.parentNode.id;
     const updateRoomName = window.prompt("Please enter a new room name:", "New room name...");

     if(updateRoomKey) {
       this.roomsRef.child(updateRoomKey).update({name: updateRoomName});
     }
   }

   deleteRoom = (e) => {
     const deleteRoomKey = document.getElementById(e.target.id).parentNode.parentNode.id;

     if(deleteRoomKey) {
       this.roomsRef.child(deleteRoomKey).remove()
       this.props.firebase.database().ref('message/' + this.props.activeRoom).remove();
     }
   }

  render() {
    return (
      <div>
        <table className="room-list-table">
          <tbody>
              {this.state.rooms.map( (room, index) =>
                <tr id={room.key} key={room.key} >
                  <td>
                    <span id={"name" + room.key} onClick={this.props.handleRoomSelect}>{room.name}</span>
                  </td>
                  <td>
                    <button
                      id={"update" + room.key}
                      className="update-button"
                      onClick={this.updateRoom}
                    >Edit</button>
                  </td>
                  <td>
                    <button
                      id={"delete" + room.key}
                      className="delete-button"
                      onClick={this.deleteRoom}
                    >Delete</button>
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        <form className="new-room-form">
          <h4>Create a New Room</h4>
          <label htmlFor="newRoomName" className="input-label" id="newRoomNameLabel">New Room Name: </label>
          <input
            type="text"
            className="input-roomname"
            id="newRoomName"
            placeholder="New room name..."
           />
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
