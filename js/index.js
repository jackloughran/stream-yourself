var ap = new APlayer({
  music: {}
});

var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://localhost:48001/api/list", true)
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var song = JSON.parse(xhr.responseText);
      listArtists(song);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.send(null);

function listArtists(songs) {

  var artistMap = parseSongs(songs);

  var app = document.getElementById('app');

  artistMap.forEach(function (value, key, map) {
    var li = document.createElement('li');
    li.innerHTML = key;

    var clickFunction = function () {
      populateAlbums(li, value, key)
      li.removeEventListener('click', clickFunction)
    }
    li.addEventListener('click', clickFunction);

    app.appendChild(li);
  });
}

function parseSongs(songs) {
  var artistMap = new Map();
  for (var i = 0; i < songs.length; i++) {
    if (artistMap.get(songs[i].artist) === undefined) {
      var titleMap = new Map([[songs[i].title, songs[i].loc]]);
      var albumMap = new Map([[songs[i].album, titleMap]]);
      artistMap.set(songs[i].artist, albumMap);
    } else {
      var albumMap = artistMap.get(songs[i].artist);
      if (albumMap.get(songs[i].album) === undefined) {
        var titleMap = new Map([[songs[i].title, songs[i].loc]]);
        albumMap.set(songs[i].album, titleMap);
      } else {
        var titleMap = albumMap.get(songs[i].album);
        titleMap.set(songs[i].title, songs[i].loc);
        albumMap.set(songs[i].album, titleMap);
      }
    }
  }

  return artistMap;
}

function populateAlbums(element, albumMap, artist) {
  var ul = document.createElement('ul');
  albumMap.forEach(function (value, key) {
    var li = document.createElement('li');

    li.innerHTML = key

    var clickFunction = function () {
      populatePlayer(value, artist)
      li.removeEventListener('click', clickFunction)
    }
    li.addEventListener('click', clickFunction)
    ul.appendChild(li)
  });

  element.appendChild(ul)
}

function populatePlayer(titleMap, artist) {
  console.log(artist)
  var music = []
  titleMap.forEach(function (value, key) {
    music.push({
      title: key,
      artist: '',
      url: value
    })
  })

  for (var i = 0; i < music.length; i++) {
    music[i].artist = artist
  }

  ap.addMusic(music)
}
