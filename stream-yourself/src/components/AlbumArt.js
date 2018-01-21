import React from 'react';

export default ({ loc }) =>
    <div
      style={{ backgroundImage: `url(${loc})` }}
      className="album-art"
      alt="album art"
    ></div>