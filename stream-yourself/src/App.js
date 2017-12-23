import React, { Component } from 'react';
import LoadingIcon from './Rolling.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      music: null,
      albums: null,
      songs: null,
      song: null,
      error: null,
    }

    this.onArtistClick = this.onArtistClick.bind(this);
    this.onAlbumClick = this.onAlbumClick.bind(this);
    this.onSongClick = this.onSongClick.bind(this);
  }

  componentDidMount() {
    // fetch('http://138.197.172.114:48001/api/list')
    fetch('http://localhost:48001/api/list')
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
    
    this.setState({ albums, songs: null });
  }

  onAlbumClick(event, album) {
    const { music } = this.state;

    const songs = music
      .filter(song => song.album === album)
      .map(song => song.title);

    this.setState({ songs });
  }

  onSongClick(event, songs) {
    const { music } = this.state;

    const song = music
      .filter(song => song.title === songs);

    console.log(song)
  }

  render() {
    const { music, albums, songs, song } = this.state;

    if (!music) {
      return (
        <center><img src={LoadingIcon} alt="loading..." /></center>
      )
    } else { 
      return (
        <div className="app">
          <div className="player-container">
            <ConditionalPlayer
              song={song}
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
            condition={songs}
            list={songs}
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

const ConditionalPlayer = ({ song }) => {
  if (song) {
    return (
      <Player
        loc={song.loc}
      />
    )
  } else {
    return (
      <p style={{color: "#eee"}}>Stream Yourself</p>
    )
  }
}

const Player = ({ loc }) => {
  return (
    <audio src={loc} controls></audio>
  )
};

export default App;
