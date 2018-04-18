import React, { Component } from 'react';

class MessageList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      messages: []
    }

    this.messagesRef = this.props.firebase.database().ref('message/' + this.props.activeRoom.key);
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      let message = {
        key: snapshot.key,
        content: snapshot.val().content
      };

      this.setState({ messages: this.state.messages.concat( message ) });
    });

    this.messagesRef.on('child_changed', snapshot => {
      let newMessage = {
        key: snapshot.key,
        name: snapshot.val().name
      }

      this.setState({ messages: this.state.messages.map( message => message.key === snapshot.key ?
        message = newMessage : message)
      });
    });

    this.messagesRef.on('child_removed', snapshot => {
      this.setState({ messages: this.state.messages.filter( message => message.key !== snapshot.key ) });
    });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.activeRoom.key !== this.props.activeRoom.key) {
      this.messagesRef = this.props.firebase.database().ref('message/' + newProps.activeRoom.key);
      let messageList = [];

      this.messagesRef.on('child_added', snapshot => {
        let message = snapshot.val();
        message.key = snapshot.key;
        messageList.push(message);
        this.setState({ messages: messageList });
      });

      if( messageList.length === 0 ) { this.setState({ messages: [] });}
    }
  }

  createNewMessage = (e) => {
    e.preventDefault();
    const newMessage = document.getElementById("newMessageContent").value;

    if(newMessage) {
      this.messagesRef.push({
        content: newMessage,
        roomId: this.props.activeRoom,
        username: this.props.user,
        sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
      })
    }

    document.getElementById('newMessageContent').value = "";
  }

  render () {
    return (
        <section className="messages">
          <section className="section-message-list">
              {this.state.messages.map( (message, index) =>
                <div id={message.key} key={index} className="message-row">
                  <span className="message-row-content">{message.content}</span>
                  <span className="message-row-metadata">
                    <span className="message-row-username">{message.username}</span>
                    <span className="message-row-ts">{message.sentAt}</span>
                  </span>

                  { ((message.username === this.props.user.username && this.props.user.username !== "Guest") ||
                    this.props.user.admin)
                   &&
                  <span className="message-row-btns">
                    <span>
                      <button
                        id={"update" + message.key}
                        className="update-button"
                        onClick={this.updateMessage}
                      ><span className="far fa-edit" /></button>
                    </span>
                    <span>
                      <button
                        id={"delete" + message.key}
                        className="delete-button"
                        onClick={this.deleteMessage}
                      ><span className="far fa-trash-alt" /></button>
                    </span>
                  </span>
                }

                </div>
              )}
          </section>
          { this.props.activeRoom.key &&
          <section className="new-messages">
              <form>
                <input
                  type="text"
                  placeholder="Write your message here..."
                  className="new-message-input"
                  id="newMessageContent"
                />
                <input type="submit"
                  className="message-submit-button"
                  id="newMessageSubmit"
                  onClick={this.createNewMessage}
                />
              </form>
          </section>
        }
      </section>
    );
  }
}

export default MessageList;
