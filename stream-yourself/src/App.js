import React, { Component } from 'react';
import LoadingIcon from './Rolling.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      music: null,
      albums: null,
      songs: [],
      albumSongs: null,
      playAlbumLink: false,
      error: null,
    }

    this.onArtistClick = this.onArtistClick.bind(this);
    this.onAlbumClick = this.onAlbumClick.bind(this);
    this.onSongClick = this.onSongClick.bind(this);
    this.onSongEnd = this.onSongEnd.bind(this);
  }

  componentDidMount() {
    fetch('http://138.197.172.114:48001/api/list')
      .then(response => response.json())
      .then(music => this.setState({ music }))
      .catch(error => this.setState({ error }));
  }

  onArtistClick(event, artist) {
    const { music } = this.state;

    const albums = music
      .filter(song => song.artist === artist)
      .map(song => song.album)
      .filter((album, index, array) => (index === 0) || (album !== array[index - 1]));

    window.scrollTo(0, 0);

    this.setState({ albums, playAlbumLink: false });
  }

  onAlbumClick(event, album) {
    const { music } = this.state;

    const albumSongs = music
      .filter(song => song.album === album)
      .map(song => song.title);

    window.scrollTo(0, 0);
    
    this.setState({ albumSongs, playAlbumLink: true });
  }

  onSongClick(event, clickedSong) {
    const { music, songs } = this.state;

    const song = music
      .filter(song => song.title === clickedSong);

    songs.push(song[0]);

    this.setState({ songs });
  }

  onSongEnd() {
    const { songs } = this.state;

    songs.shift();

    this.setState({ songs });
  }

  render() {
    const { music, albums, albumSongs, playAlbumLink, songs } = this.state;

    if (!music) {
      return (
        <center><img src={LoadingIcon} alt="loading..." /></center>
      )
    } else { 
      return (
        <div className="app">
          <div className="player-container">
            <ConditionalPlayer
              songs={songs}
              songEnd={this.onSongEnd}
            />
            <ConditionalPlayAlbumLink
              condition={playAlbumLink}
            />
          </div>
          <MusicTable
            list={music
              .map(song => song.artist)
              .sort()
              .filter((artist, index, array) => (index === 0) || (artist !== array[index - 1]))
            }
            listClassName="music-list__artists"
            onClick={this.onArtistClick}
          />
          <ConditionalMusicTable
            condition={albums}
            list={albums}
            listClassName="music-list__albums"
            onClick={this.onAlbumClick}
          />
          <ConditionalMusicTable
            condition={albumSongs}
            list={albumSongs}
            listClassName="music-list__songs"
            onClick={this.onSongClick}
          />
        </div>
      )
    }
  }
}

const ConditionalMusicTable = ({ condition, list, listClassName, onClick }) => {
  if (condition) {
    return (
      <MusicTable
        list={list}
        listClassName={listClassName}
        onClick={onClick}
      />
    )
  } else {
    return(<span></span>)
  }
}

const MusicTable = ({ list, listClassName, onClick }) => {
  return (
    <ul className={"music-list  " + listClassName }>
      {list
      .map((item, index) =>
        <li key={item}>
          <MusicItem
            className={index === 0 ? "list-button__top" : "list-button_non-top"}
            artist={item}
            onClick={e => onClick(e, item)}
          />
        </li>
      )}
    </ul>
  )
}

const MusicItem = ({ className, artist, onClick }) =>
  <button className={"list-button  " + className} onClick={onClick}>
    <span>{artist}</span>
  </button>

const ConditionalPlayer = ({ songs, songEnd }) => {
  if (songs[0]) {
    return (
      <Player
        loc={songs[0].loc}
        song={songs[0].title}
        songEnd={songEnd}
      />
    )
  } else {
    return (
      <p className="random-text">Stream Yourself</p>
    )
  }
};

const Player = ({ loc, song, songEnd }) => {
  return (
    <span>
      <audio className="player" src={loc}
        onEnded={songEnd}
        autoPlay
        controls>Get a modern browser!</audio>
      <span className="player__now-playing">Now Playing: {song}</span>
    </span>
  )
};

const ConditionalPlayAlbumLink = ({ condition }) => {
  if (condition) {
    return (
      <p className="random-text  right-text">Play full album</p>
    )
  } else {
    return (
      <p className="random-text  right-text">Stream Yourself</p>
    )
  }
}

export default App;
