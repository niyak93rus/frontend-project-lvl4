// import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectors } from '../slices/usersSlice.js';

const Message = ({ message }) => {
  return (
    <div className="card">
      <div className="card-header">
        {`${message.body}`}
      </div>
    </div>
  );
};

export default Message;
