import React from 'react';
import { useSelector } from 'react-redux';

// import { selectors } from '../slices/channelsSlice.js';

const Channels = () => {
  const { channels } = useSelector((state) => state.channelsReducer);

  return (
      <nav className="navbar w-25">
        <div className="mt-3">
          <ul className="list-group">
            {channels.map((channel) => (
              <li key={channel.id} className="list-group-item">
                <h3>{channel.name}</h3>
              </li>
            ))}
          </ul>
        </div>
      </nav>
  );
};

export default Channels;