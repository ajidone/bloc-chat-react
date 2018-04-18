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
       let room = {
         key: snapshot.key,
         name: snapshot.val().name
        };

        this.setState({ rooms: this.state.rooms.concat( room ) });
     });

     this.roomsRef.on('child_changed', snapshot => {
       let newRoom = {
         key: snapshot.key,
         name: snapshot.val().name
       }

       this.setState({ rooms: this.state.rooms.map( room => room.key === snapshot.key ?
         room = newRoom : room)
       });
     });

     this.roomsRef.on('child_removed', snapshot => {
       this.setState({ rooms: this.state.rooms.filter( room => room.key !== snapshot.key ) });
     });
   }


   createNewRoom = (e) => {
     e.preventDefault();
     const newRoomName = document.getElementById('new-room-name').value;

     (newRoomName ?
       this.roomsRef.push({
         name: newRoomName
       })
     :
       alert("Please enter a room name!")
     );

     document.getElementById('new-room-name').value = "";
   }

   updateRoom = (e) => {
     const updateRoomKey = e.target.parentNode.id.replace("update","");
     const updateRoomName = window.prompt("Please enter a new room name:", "New room name...");

     if(updateRoomKey) {
       this.roomsRef.child(updateRoomKey).update({name: updateRoomName});
     }
   }

   deleteRoom = (e) => {
     const deleteRoomKey = e.target.parentNode.id.replace("delete","");

     if(deleteRoomKey) {
       this.roomsRef.child(deleteRoomKey).remove()
       this.props.firebase.database().ref('message/' + this.props.activeRoom).remove();
     }
   }

  render() {
    return (
      <div className="rooms">
        <section className="room-list">
          <ul>
            {this.state.rooms.map( (room, index) =>
              <li id={room.key} key={room.key} className={ room.key === this.props.activeRoom ? "active-room-selection" : "inactive-room-selection"}>
                  <span className="room-name" id={"name" + room.key} onClick={this.props.handleRoomSelect}>{room.name}</span>
                  {true && //this.props.user.admin
                    <span className="room-buttons">
                      <button
                        id={"update" + room.key}
                        className="update-button"
                        onClick={this.updateRoom}
                      ><span className="far fa-edit" /></button>

                      <button
                        id={"delete" + room.key}
                        className="delete-button"
                        onClick={this.deleteRoom}
                      ><span className="far fa-trash-alt" /></button>
                    </span>
                  }
                </li>
            )}
          </ul>
        </section>

        {true && //this.props.user.admin
          <form className="new-room-form">
            <h4>Create a New Room</h4>
            <label htmlFor="new-room-name" className="input-label" id="new-room-name-label">New Room Name: </label>
            <input
              type="text"
              className="room-name-input"
              id="new-room-name"
              placeholder="New room name..."
             />
            <input type="submit"
              className="submit-button"
              id="new-room-submit"
              onClick={this.createNewRoom}
            />
          </form>
        }
      </div>

    );
  }
}

export default RoomList;
