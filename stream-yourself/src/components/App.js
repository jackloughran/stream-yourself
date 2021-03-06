import React, { Component } from 'react';
import LoadingIcon from '../Rolling.svg';
import './App.css';

import AlbumList from './AlbumList';
import AlbumArt from './AlbumArt';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      persistedMusic: null,
      music: null,
      artists: null,
      albums: null,
      songs: [],
      albumSongs: null,
      selectedArtistIndex: null,
      selectedAlbumIndex: null,
      error: null,
    }

    this.onArtistClick = this.onArtistClick.bind(this);
    this.onAlbumClick = this.onAlbumClick.bind(this);
    this.onSongClick = this.onSongClick.bind(this);
    this.onSongEnd = this.onSongEnd.bind(this);
    this.playAlbum = this.playAlbum.bind(this);
    this.onPlaylistClick = this.onPlaylistClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    fetch('http://138.197.172.114:48001/api/list')
      .then(response => response.json())
      .then(persistedMusic => {
        this.setState({
          persistedMusic,
          music: persistedMusic,
          artists: persistedMusic
          .sort((a, b) => a.artist < b.artist ? -1 : 1)
          .filter((song, index, array) => (index === 0) || (song.artist !== array[index - 1].artist))
          .map(item => item.artist),
        })
      })
      .catch(error => this.setState({ error }));
    
    document.onkeydown = e => {
      const filter = document.getElementById('filter');
      const player = document.getElementById("player");
      if (e.keyCode === 32) {
        if (filter !== document.activeElement) {
          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
          return false;
        }
      } else if (e.keyCode === 78) {
        if (filter !== document.activeElement) {
          this.onSongEnd();
        }
      } else if (e.keyCode === 68) {
        if (filter !== document.activeElement) {
          this.setState({ songs: [] });
          player.src = '';
        }
      } else if (e.keyCode === 70) {
        if (filter !== document.activeElement) {
          filter.focus();
          filter.value = '';
          this.setState({ music: this.state.persistedMusic });
          return false;
        }
      } else if (e.keyCode === 13) {
        // enter
        if (filter === document.activeElement) {
          const { albums, selectedAlbumIndex, albumSongs } = this.state;
          const album = albums[selectedAlbumIndex];
          if (!albumSongs) {
            this.onAlbumClick(null, album);
          } else {
            this.playAlbum();
          }
        }
      } else if (e.keyCode === 40) {
        // down arrow
        if (filter === document.activeElement) {
          const { selectedArtistIndex, artists } = this.state;
          if (artists.length > selectedArtistIndex + 1) {
            const newIndex = selectedArtistIndex + 1;
            this.setState({ selectedArtistIndex: newIndex, selectedAlbumIndex: 0 });
            this.onArtistClick(null, artists[newIndex]);
          }
        }
      } else if (e.keyCode === 38) {
        // up arrow
        if (filter === document.activeElement) {
          const { selectedArtistIndex, artists } = this.state;
          if (selectedArtistIndex > 0) {
            const newIndex = selectedArtistIndex - 1;
            this.setState({ selectedArtistIndex: newIndex, selectedAlbumIndex: 0 });
            this.onArtistClick(null, artists[newIndex]);
          }
        }
      } else if (e.keyCode === 27) {
        if (filter === document.activeElement) {
          filter.blur();
        }
      } else if (e.keyCode === 39) {
        // right arrow
        if (filter === document.activeElement) {
          const { selectedAlbumIndex, albums } = this.state;
          if (albums.length > selectedAlbumIndex + 1) {
            const newIndex = selectedAlbumIndex + 1;
            this.setState({ selectedAlbumIndex: newIndex });
          }
          return false;
        }
      } else if (e.keyCode === 37) {
        // left arrow
        if (filter === document.activeElement) {
          const { selectedAlbumIndex } = this.state;
          if (selectedAlbumIndex > 0) {
            const newIndex = selectedAlbumIndex - 1;
            this.setState({ selectedAlbumIndex: newIndex});
          }
        }
        return false;
      }
    }
  }

  onArtistClick(event, artist) {
    const { music } = this.state;

    const albums = music
      .filter(song => song.artist === artist)
      .sort((a, b) => a.album < b.album ? -1 : 1)
      .filter((song, index, array) => (index === 0) || (song.album !== array[index - 1].album));

    this.setState({ albums, albumSongs: null });
  }

  onAlbumClick(event, item) {
    const { music } = this.state;

    const albumSongs = music
      .filter(song => song.artist === item.artist)
      .filter(song => song.album === item.album)
      .sort((a, b) => a.id - b.id);

    window.scrollTo(0, 0);
    
    this.setState({ albumSongs, playAlbumLink: true });
  }

  onSongClick(event, item) {
    const { music, songs } = this.state;
    const changeSong = songs.length === 0;

    const song = music
      .filter(song => song.id === item.id);

    if (songs.filter(s => s.id === song[0].id) <= 0) {
      songs.push(song[0]);
    }

    if (changeSong) {
      addSong(songs[0]);
    }

    this.setState({ songs });
  }

  onSongEnd() {
    const { songs } = this.state;

    songs.shift();

    if (songs.length > 0) {
      addSong(songs[0]);
    }

    this.setState({ songs });
  }

  playAlbum() {
    const { songs, albumSongs } = this.state;
    const changeSong = songs.length === 0;

    const nonDuplicateAlbumSongs = albumSongs.filter(song => songs.filter(s => s.id === song.id) <= 0);

    songs.push(...nonDuplicateAlbumSongs);

    if (changeSong) {
      addSong(songs[0]);
    }

    this.setState({ songs });
  }

  onPlaylistClick(event, item) {
    const { songs } = this.state;

    this.setState({
      songs: songs.filter(song => song.id !== item.id),
    });
  }

  onSearch(event) {
    const { persistedMusic } = this.state;
    const searchTerm = event.target.value;
    const artists = persistedMusic
    .filter(item => item.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.artist < b.artist ? -1 : 1)
    .filter((song, index, array) => (index === 0) || (song.artist !== array[index - 1].artist))
    .map(item => item.artist);

    if (artists.length > 0) {
      this.onArtistClick(null, artists[0]);
    }
    if (searchTerm === '') {
      this.setState({ artists, selectedArtistIndex: null, selectedAlbumIndex: null, albums: null });
    } else {
      this.setState({ artists, selectedArtistIndex: 0, selectedAlbumIndex: 0, albumSongs: null });
    }
  }

  render() {
    const { music, albums, albumSongs, songs, artists, selectedArtistIndex, selectedAlbumIndex } = this.state;

    if (!music) {
      return (
        <center><img src={LoadingIcon} alt="loading..." /></center>
      )
    } else { 
      return (
        <div className="app">
          <div className="filter-container">
            <Search
              onChange={this.onSearch}
            />
          </div>
          <div className="header"><h1>Stream Yourself</h1></div>
          <div className="player-container">
          <Player
            songEnd={this.onSongEnd}/>
            {songs.length > 0 &&
            <SongInfo
              song={songs[0]}
              songEnd={this.onSongEnd}
            />}
            {songs.length > 1 &&
            <button
              className="top-button  clear-text  button"
              onClick={() => this.setState({ songs: songs.slice(0, 1) })}
            >Clear Queue
            </button>}
          </div>
          <div className="side-bar side-bar__left">
            <div className="side-bar__artists">
              <MusicTable
                list={artists}
                objectKey="artist"
                onClick={this.onArtistClick}
                selectedIndex={selectedArtistIndex}
              />
            </div>
          </div>
          <div className="content-spacing">
            {albums && !albumSongs &&
              <AlbumList
                list={albums}
                onClick={this.onAlbumClick}
                selectedIndex={selectedAlbumIndex}
              />
            }
            {albumSongs &&
              <SongList
                list={albumSongs}
                onSongClick={this.onSongClick}
                onAlbumClick={this.playAlbum}
              />
            }
          </div>
          <div className="side-bar side-bar__right">
            <div className="queue-header"><h2>Queue</h2></div>
            {songs.length > 1 &&
              <Playlist
                list={songs.slice(1)}
                onClick={this.onPlaylistClick}
              />
            }
          </div>
          {songs.length > 1 &&
            <audio src={songs[1].loc}></audio>
          }
        </div>
      )
    }
  }
}

class SongList extends Component {
  render() {
    const { list, onSongClick, onAlbumClick } = this.props;
    return (
      <div className="song-list">
          <div className="songs-album">
            <div className="album-art-hover" onClick={onAlbumClick}><AlbumArt loc={list[0].artLoc} /></div>
            <div className="songs-album__album-info">
              <div className="songs-album__album-info__album-name"><h3>{list[0].album}</h3></div>
              <div className="songs-album__album-info__album-artist">
                <span style={{color: "rgba(238, 238, 238, 0.6)"}}>By </span>{list[0].artist}
              </div>
            </div>
          </div>
        <div className="songs-list">
          {list
            .map((item, index) =>
            <div className="songs-item" key={item.id}>
              <a className="song" onClick={e => onSongClick(e, item)}>{index + 1}. {item.title}</a>
            </div>
          )
          }
        </div>
      </div>
    )
  }
}

const MusicTable = ({ list, listClassName, onClick, selectedIndex }) => {
  return (
    <ul className="music-list">
      {list
      .map((item, index) =>
        <li key={item}>
          <MusicItem
            className={index === selectedIndex ? "selected-item" : ""}
            item={item}
            onClick={e => onClick(e, item)}
          />
        </li>
      )}
    </ul>
  )
}

const Playlist = ({ list, onClick }) => {
  return (
    <ul className="music-list">
      {list
        .map((item, index) =>
          <li key={item.id}>
            <a className="song" onClick={e => onClick(e, item)}>{index + 1}. {item.title}</a>
          </li>
      )
      }
    </ul>
  )
}

const Search = ({ onChange }) =>
  <input
    type="search"
    placeholder="filter artists"
    className="filter"
    onClick={() => document.getElementById('filter').select()}
    id="filter"
    onChange={onChange}
  />

const MusicItem = ({ className, item, onClick }) =>
  <button className={"list-button  button  " + className} onClick={onClick}>
    <span>{item}</span>
  </button>

const SongInfo = ({ song, songEnd }) => {
  document.title = song.title + " by " + song.artist;
  return (
    <span>
      <button className="top-button  next-button  button" onClick={songEnd}>{'>'}</button>
      <div className="player__now-playing">
        <div className="player__now-playing__album-art">
          <AlbumArt loc={song.artLoc} />
        </div>
        <div className="player__now-playing__track-info">
          <span className="player__now-playing__track-info__track-name">{song.title}</span>
          <span className="player__now-playing__track-info__artist-name">{song.artist}</span>
        </div>
      </div>
    </span>
  )
};

const Player = ({ songEnd }) =>
  <audio className="player" id="player"
    onEnded={songEnd}
    autoPlay
    controls>Get a modern browser!</audio>

function addSong(song) {
  const player = document.getElementById('player');

  player.src = song.loc;
  player.play();
};

export default App;
