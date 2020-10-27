/*
import React from "react";
import PropTypes from "prop-types";

const style = {
  top: "auto"
};

const Message = props => {
  return (
    <section data-testid="message">
      <div className={`notification is-${props.messageType}`}>
        <button
          className="delete"
          style={style}
          onClick={() => {
            props.removeMessage();
          }}
        />
        <span className="message-text">{props.messageText}</span>
      </div>
    </section>
  );
};

Message.propTypes = {
  messageType: PropTypes.string.isRequired,
  messageText: PropTypes.string.isRequired,
  removeMessage: PropTypes.func.isRequired
};

export default Message;
*/


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Message.css';

class Message extends Component {
  static propTypes = {
    author: PropTypes.string,
    body: PropTypes.string,
    me: PropTypes.bool,
  }

  render() {
    const classes = classNames('Message', {
      log: !this.props.author,
      me: this.props.me
    })

    return (
      <div className={classes}>
        {this.props.author && (
          <span className="author">{this.props.author}:</span>
        )}
        {this.props.body}
      </div>
    )
  }
}

export default Message