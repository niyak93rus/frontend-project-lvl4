import React from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
  // ????
  const author = useSelector((state) => {
    const currentAuthor = state.usersReducer.users.find(({ id }) => id === message.author);
    return currentAuthor;
  });

  return (
    <div className="card">
      <div className="card-header">
        {`${message.body} - ${author.name}`}
      </div>
    </div>
  );
};

export default Message;
