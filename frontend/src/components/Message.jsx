import React from 'react';

const Message = ({ message }) => {
  const username = message.username || 'anon';

  return (
    <div className="card">
      <div className="card-header">
        {`${username}: ${message.body}`}
      </div>
    </div>
  );
};

export default Message;
