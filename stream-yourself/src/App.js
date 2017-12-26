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
    this.playAlbum = this.playAlbum.bind(this);
    this.onPlaylistClick = this.onPlaylistClick.bind(this);
  }

  componentDidMount() {
    fetch('http://138.197.172.114:48001/api/list')
      .then(response => response.json())
      .then(music => this.setState({ music }))
      .catch(error => this.setState({ error }));
  }

  onArtistClick(event, item) {
    const { music } = this.state;

    const artist = item.artist;

    const albums = music
      .filter(song => song.artist === artist)
      .sort((a, b) => a.album < b.album ? -1 : 1)
      .filter((song, index, array) => (index === 0) || (song.album !== array[index - 1].album));

    window.scrollTo(0, 0);

    this.setState({ albums, playAlbumLink: false });
  }

  onAlbumClick(event, item) {
    const { music } = this.state;

    const albumSongs = music
      .filter(song => song.artist === item.artist)
      .filter(song => song.album === item.album);

    window.scrollTo(0, 0);
    
    this.setState({ albumSongs, playAlbumLink: true });
  }

  onSongClick(event, item) {
    const { music, songs } = this.state;

    const song = music
      .filter(song => song.title === item.title);

    songs.push(song[0]);

    this.setState({ songs });
  }

  onSongEnd() {
    const { songs } = this.state;

    songs.shift();

    this.setState({ songs });
  }

  playAlbum() {
    const { songs, albumSongs } = this.state;

    songs.push(...albumSongs);

    this.setState({ songs });
  }

  onPlaylistClick(event, clickedSong) {
    console.log(clickedSong);
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
              onClick={this.playAlbum}
            />
          </div>
          <MusicTable
            list={music
              .sort((a, b) => a.artist < b.artist ? -1 : 1)
              .filter((song, index, array) => (index === 0) || (song.artist !== array[index - 1].artist))
            }
            objectKey="artist"
            listClassName="music-list__artists"
            onClick={this.onArtistClick}
          />
          <ConditionalMusicTable
            condition={albums}
            list={albums}
            objectKey="album"
            listClassName="music-list__albums"
            onClick={this.onAlbumClick}
          />
          <ConditionalMusicTable
            condition={albumSongs}
            list={albumSongs}
            objectKey="title"
            listClassName="music-list__songs"
            onClick={this.onSongClick}
          />
          <ConditionalMusicTable
            condition={songs}
            list={songs}
            objectKey="title"
            listClassName="music-list__playlist"
            onClick={this.onPlaylistClick}
          />
        </div>
      )
    }
  }
}

const ConditionalMusicTable = ({ condition, list, listClassName, onClick , objectKey }) => {
  if (condition) {
    return (
      <MusicTable
        list={list}
        listClassName={listClassName}
        objectKey={objectKey}
        onClick={onClick}
      />
    )
  } else {
    return(<span></span>)
  }
}

const MusicTable = ({ list, listClassName, onClick, objectKey }) => {
  console.log(list)
  return (
    <ul className={"music-list  " + listClassName }>
      {list
      .map((item, index) =>
        <li key={item.id}>
          <MusicItem
            className={index === 0 ? "list-button__top" : "list-button_non-top"}
            item={item[objectKey]}
            onClick={e => onClick(e, item)}
          />
        </li>
      )}
    </ul>
  )
}

const MusicItem = ({ className, item, onClick }) =>
  <button className={"list-button  button  " + className} onClick={onClick}>
    <span>{item}</span>
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
      <button className="top-button  random-text  next-button  button" onClick={songEnd}>next</button>
      <span className="player__now-playing">Now Playing: {song}</span>
    </span>
  )
};

const ConditionalPlayAlbumLink = ({ condition, onClick }) => {
  if (condition) {
    return (
      <button className="top-button  right-text  random-text  button" onClick={onClick}>Play full album</button>
    )
  } else {
    return (
      <p className="random-text  right-text">Stream Yourself</p>
    )
  }
}

export default App;
