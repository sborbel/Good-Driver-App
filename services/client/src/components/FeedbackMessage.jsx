import React from "react";
import PropTypes from "prop-types";

const style = {
  top: "auto"
};

const FeedbackMessage = props => {
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

FeedbackMessage.propTypes = {
  messageType: PropTypes.string.isRequired,
  messageText: PropTypes.string.isRequired,
  removeMessage: PropTypes.func.isRequired
};

export default FeedbackMessage;
