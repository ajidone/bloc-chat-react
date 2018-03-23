import React, { Component } from 'react';

class MessageList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      messages: []
    }

    this.messagesRef = this.props.firebase.database().ref('messages').child(this.props.activeRoom);
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const messages = snapshot.val();
      messages.key = snapshot.key;
      this.setState({messages: this.state.messages.concat( messages )})
    });
  }

  render () {
    return (
      <section>
        <h2 className="active-room-label" key={this.props.activeRoom}>{this.props.activeRoom}</h2>
        <ol>
          {this.state.messages.map( (message, index) =>
            <li key={index}>
              {message.message}
            </li>
          )}
        </ol>
      </section>
    );
  }
}

export default MessageList;
