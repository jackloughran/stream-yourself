import React, { Component } from 'react';
import LoadingIcon from './Rolling.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      persistedMusic: null,
      music: null,
      albums: null,
      songs: [],
      albumSongs: null,
      playAlbumLink: false,
      nowPlaying: null,
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
      .then(persistedMusic => this.setState({ persistedMusic, music: persistedMusic }))
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

    this.setState({ albums, playAlbumLink: false, albumSongs: null });
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

    const song = music
      .filter(song => song.id === item.id);

    if (songs.filter(s => s.id === song[0].id) <= 0) {
      songs.push(song[0]);
    }

    this.setState({ songs });
  }

  onSongEnd() {
    const { songs } = this.state;

    songs.shift();

    this.setState({ songs });
  }

  playAlbum() {
    const { songs, albumSongs } = this.state;

    const nonDuplicateAlbumSongs = albumSongs.filter(song => songs.filter(s => s.id === song.id) <= 0);

    songs.push(...nonDuplicateAlbumSongs);

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
    this.setState({
      music: persistedMusic
        .filter(item => item.artist.toLowerCase().includes(searchTerm.toLowerCase())
                     || item.album.toLowerCase().includes(searchTerm.toLowerCase())
                     || item.title.toLowerCase().includes(searchTerm.toLowerCase())),
    });
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
            {songs.length > 1 &&
              <audio src={songs[1].loc}></audio>
            }
            <Search
              onChange={this.onSearch}
            />
            {songs.length > 0 &&
            <Player
              loc={songs[0].loc}
              song={songs[0].title}
              songEnd={this.onSongEnd}
            />}
            {playAlbumLink &&
              <button className="top-button  right-text  random-text  button" onClick={this.playAlbum}>Play full album</button>
            }
            {songs.length > 1 &&
            <button
              className="top-button  clear-text  random-text  button"
              onClick={() => this.setState({ songs: songs.slice(0, 1) })}
            >Clear
            </button>}
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
            condition={songs.length > 1}
            list={songs.slice(1)}
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

const Search = ({ onChange }) =>
  <input
    style={{ margin: "15px" }}
    type="search"
    placeholder="filter"
    className="filter"
    onClick={() => document.getElementById('filter').select()}
    id="filter"
    onChange={onChange}
  />

const MusicItem = ({ className, item, onClick }) =>
  <button className={"list-button  button  " + className} onClick={onClick}>
    <span>{item}</span>
  </button>

const Player = ({ loc, song, songEnd }) => {
  const pauseEvent = e => {
    if (e.keyCode === 32) {
      const player = document.getElementById("player");
      player.pause();
      return false;
    }
  }

  document.onkeydown = pauseEvent;
  return (
    <span>
      <audio className="player" src={loc} id="player"
        onEnded={songEnd}
        autoPlay
        controls>Get a modern browser!</audio>
      <button className="top-button  random-text  next-button  button" onClick={songEnd}>{'>'}`</button>
      <span className="player__now-playing">{song}</span>
    </span>
  )
};

export default App;
