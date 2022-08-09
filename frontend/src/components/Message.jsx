import React from 'react';

const Message = ({ message }) => (
    <div className="card">
      <div className="card-header">
        {`${message.username}: ${message.body}`}
      </div>
    </div>
);

export default Message;
