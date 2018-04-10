import React, { Component } from 'react';

class MessageList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      messages: []
    }

    this.messagesRef = this.props.firebase.database().ref('message/' + this.props.activeRoom);
  }

  componentDidMount() {
    if(this.props.activeRoom) {
      this.messagesRef.on('value', snapshot => {
        const messageList = [];

        snapshot.forEach( message => {
         messageList.push({
            key: message.key,
            content: message.val().content,
            roomId: message.val().roomId,
            sentAt: message.val().sentAt,
            username: message.val().username,
          });
        });
        this.setState({ messages: messageList});
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.activeRoom !== this.props.activeRoom) {
      this.messagesRef = this.props.firebase.database().ref('message/' + newProps.activeRoom);

      this.messagesRef.on('value', snapshot => {
        const messageList = [];

        snapshot.forEach( message => {
         messageList.push({
            key: message.key,
            content: message.val().content,
            roomId: message.val().roomId,
            sentAt: message.val().sentAt,
            username: message.val().username,
          });
        });
        this.setState({ messages: messageList});
      });
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

  updateMessage = (e) => {
    const updateMessageKey = document.getElementById(e.target.id).parentNode.parentNode.parentNode.id;
    const oldMessageContent = this.state.messages.find( message => message.key === updateMessageKey)
    const updateMessageContent = window.prompt("Please enter a new message:", oldMessageContent.content);

    if(updateMessageKey) {
      this.messagesRef.child(updateMessageKey).update({content: updateMessageContent});
    }
  }

  deleteMessage = (e) => {
    const deleteMessageKey = document.getElementById(e.target.id).parentNode.parentNode.parentNode.id;

    if(deleteMessageKey) {
      this.messagesRef.child(deleteMessageKey).remove()
    }
  }

  render () {
    return (
        <section className="messages">
          <section className="section-message-list">
              {this.state.messages.map( (message, index) =>
                <div id={message.key} key={index} className="message-row">
                  <span className="message-row-content">{message.content}</span>
                  <div className="message-row-metadata">
                    <span className="message-row-username">{message.username}</span>
                    <span className="message-row-ts">{message.sentAt}</span>
                  </div>
                  <div className="message-row-btns">
                    <span>
                      <button
                        id={"update" + message.key}
                        className="update-button"
                        onClick={this.updateMessage}
                      >Edit</button>
                    </span>
                    <span>
                      <button
                        id={"delete" + message.key}
                        className="delete-button"
                        onClick={this.deleteMessage}
                      >X</button>
                    </span>
                  </div>
                </div>
              )}
          </section>
          { this.props.activeRoom &&
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
