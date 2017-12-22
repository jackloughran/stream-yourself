import React, { Component } from 'react';
import LoadingIcon from './Rolling.svg';
import Play from './media-play.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      music: null,
      error: null,
    }
  }

  componentDidMount() {
    fetch('http://138.197.172.114:48001/api/list')
      .then(response => response.json())
      .then(music => this.setState({ music }))
      .catch(error => this.setState({ error }));
  }

  render() {
    const { music } = this.state;
    console.log(music);

    return (
      <div>
        { !music
          ? <center><img src={LoadingIcon} /></center>
          : <Player
              song={music[0].title}
              loc={'http://138.197.172.114' + music[0].loc}
            />
        }
      </div>
    );
  }
}

const Player = ({ song, loc }) => {
  return (
    <div>
      <audio src={loc} controls></audio>
    </div>
  )
};


export default App;
