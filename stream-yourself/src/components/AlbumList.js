import React from 'react';

import AlbumArt from './AlbumArt';

export default ({ list, onClick, selectedIndex }) => {
    return (
      <div className="album-list">
        {list
          .map((item, index) =>
            <div className={selectedIndex === index ? "album-icon  selected-item" : "album-icon"} onClick={e => onClick(e, item)} key={item.id}>
              <AlbumArt loc={item.artLoc} />
              <div className="album-name-container">
                <a className="album-name">{item.album}</a>
              </div>
            </div>
          )}
       </div>
    )
  }