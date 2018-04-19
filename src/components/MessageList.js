import React, { Component } from 'react';
import moment from 'moment'
import { Panel } from 'react-bootstrap';

class MessageList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      messages: [],
      isTyping: false
    }

    this.messagesRef = this.props.firebase.database().ref('message/' + this.props.activeRoom.key);
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      let message = snapshot.val();
      message.key = snapshot.key;

      this.setState({ messages: this.state.messages.concat( message ) });
    });

    this.messagesRef.on('child_changed', snapshot => {
      let newMessage = snapshot.val();
      newMessage.key = snapshot.key;

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


      const typingRef = this.props.firebase.database().ref("typing/" + newProps.activeRoom.key);
      typingRef.on('child_changed', snapshot => {
        this.setState({ isTyping: snapshot.val() })
      });
    }
  }

  createNewMessage = (e) => {
    e.preventDefault();
    const newMessage = document.getElementById("newMessageContent").value;

    if(newMessage) {
      this.messagesRef.push({
        content: newMessage,
        roomId: this.props.activeRoom.key,
        username: this.props.user.username,
        sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
      })
    }

    document.getElementById('newMessageContent').value = "";

    let msgContainer = document.getElementById('sectionMessageList');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  updateMessage = (e) => {
    const updateMessageKey = e.target.parentNode.id.replace("update","");
    const oldMessageContent = this.state.messages.find( message => message.key === updateMessageKey)
    const updateMessageContent = window.prompt("Please enter a new message:", oldMessageContent.content);

    if(updateMessageKey) {
      this.messagesRef.child(updateMessageKey).update({content: updateMessageContent});
    }
  }

  deleteMessage = (e) => {
    const deleteMessageKey = e.target.parentNode.id.replace("delete","");

    if(deleteMessageKey) {
      this.messagesRef.child(deleteMessageKey).remove()
    }
  }

  handleKeyDown = (e) => {
    const typingRef = this.props.firebase.database().ref("typing/" + this.props.activeRoom.key);
    typingRef.update({isTyping: true});
    setTimeout(() => {
      typingRef.update({isTyping: false});
    }, 4000);
  }

  render () {
    return (
        <section className="messages">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{this.props.activeRoom.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <section className="section-message-list" id="sectionMessageList">
              {this.state.messages.map( (message, index) =>
                <div id={message.key} key={index} className="message-row">
                  <span className="message-row-content">{message.content}</span>
                  <span className="message-row-metadata">
                    <span className="message-row-username">{message.username}</span>
                    <span className="message-row-ts">
                    {moment.unix(message.sentAt/1000).fromNow()}
                    </span>
                  </span>

                  { ((message.username === this.props.user.username && this.props.user.username !== "Guest") ||
                    this.props.user.admin)
                   &&
                   <span className="message-row-pull-right">
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
                  onKeyDown={this.handleKeyDown}
                />
                <input type="submit"
                  className="message-submit-button"
                  id="newMessageSubmit"
                  onClick={this.createNewMessage}
                />
              </form>
              {this.state.isTyping &&
                <span className="typing-alert">
                   A user is typing...
                </span>
              }
          </section>
        }
        </Panel.Body>
      </section>
    );
  }
}

export default MessageList;
