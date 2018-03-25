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
    const messageList = [];

    this.messagesRef.on('child_added', snapshot => {
      let message = snapshot.val();
      message.key = snapshot.key;
      messageList.push(message);
    });
    this.setState({messages: messageList});
  }

  componentWillReceiveProps(newProps) {
    if(newProps.activeRoom !== this.props.activeRoom) {
      this.messagesRef = this.props.firebase.database().ref('message/' + newProps.activeRoom);
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

  render () {
    return (
      <section className="section-message-list">
      <h2>{this.props.activeRoom}</h2>
        <table className="table-message-list">
          <tbody>
            {this.state.messages.map( (message, index) =>
              <tr key={index}>
                <td>{message.content}</td>
                <td>{message.username}</td>
                <td>{message.sentAt}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    );
  }
}

export default MessageList;
