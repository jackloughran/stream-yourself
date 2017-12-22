import React, { Component } from 'react';
import LoadingIcon from './Rolling.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      music: null,
      error: null,
    }

    this.onArtistClick = this.onArtistClick.bind(this);
  }

  componentDidMount() {
    fetch('http://138.197.172.114:48001/api/list')
      .then(response => response.json())
      .then(music => this.setState({ music }))
      .catch(error => this.setState({ error }));
  }

  onArtistClick(event, artist) {
    console.log(artist);
  }

  render() {
    const { music } = this.state;
    console.log(music);

    return (
      <div>
        { !music
          ? <center><img src={LoadingIcon} alt="loading..." /></center>
          : 
          <div>
            <Player
              song={music[0].title}
              loc={'http://138.197.172.114' + music[0].loc}
            />
            <MusicTable
              music={music}
              onClick={this.onArtistClick}
            />
          </div>
        }
      </div>
    );
  }
}

const MusicTable = ({ music, onClick }) => {
  return (
    <div>
      {music
      .map(song => song.artist)
      .sort()
      .filter((artist, index, array) => (index === 0) || (artist !== array[index - 1]))
      .map(artist =>
        <ArtistItem
          artist={artist}
          key={artist}
          onClick={(artist) => onClick(artist)}
        />
      )}
    </div>
  )
}

const ArtistItem = ({ artist, onClick }) =>
  <button style={{marginLeft: "50px"}} onClick={onClick}>
    <span>{artist}</span>
  </button>

const Player = ({ song, loc }) => {
  return (
    <div>
      <audio src={loc} controls></audio>
    </div>
  )
};

export default App;
