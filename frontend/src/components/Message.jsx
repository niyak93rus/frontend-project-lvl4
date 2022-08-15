import React from 'react';

const Message = ({ message }) => (
    <div className="overflow-auto px-5">
      <div className="text-break mb-2">
        <b>{`${message.username}: `}</b>
        {`${message.body}`}
      </div>
    </div>
);

export default Message;
