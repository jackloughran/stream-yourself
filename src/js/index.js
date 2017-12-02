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
    li.className = "music-list  music-list__artist-item  disable-select"
    var span = document.createElement('span')
    span.innerHTML = key;

    var collapseFunction = function () {
      span.removeChild(li.lastChild)
      span.removeEventListener('click', collapseFunction)
      span.addEventListener('click', expandFunction)
    }

    var expandFunction = function () {
      populateAlbums(li, value, key)
      span.removeEventListener('click', expandFunction)
      span.addEventListener('click', collapseFunction)
    }
    span.addEventListener('click', expandFunction);
    li.appendChild(span)

    app.appendChild(li);
  });
}

function parseSongs(songs) {
  var artistMap = new Map();
  for (var i = 0; i < songs.length; i++) {
    if (artistMap.get(songs[i].artist) === undefined) {
      var titleMap = new Map([[songs[i].title, [songs[i].loc, songs[i].coverArt]]]);
      var albumMap = new Map([[songs[i].album, titleMap]]);
      artistMap.set(songs[i].artist, albumMap);
    } else {
      var albumMap = artistMap.get(songs[i].artist);
      if (albumMap.get(songs[i].album) === undefined) {
        var titleMap = new Map([[songs[i].title, [songs[i].loc, songs[i].coverArt]]]);
        albumMap.set(songs[i].album, titleMap);
      } else {
        var titleMap = albumMap.get(songs[i].album);
        titleMap.set(songs[i].title, [songs[i].loc, songs[i].coverArt]);
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
    li.className = "music-list  music-list__album-item  disable-select"

    li.innerHTML = key

    var clickFunction = function () {
      populatePlayer(value, artist, key)
      li.removeEventListener('click', clickFunction)
    }
    li.addEventListener('click', clickFunction)
    ul.appendChild(li)
  });

  element.appendChild(ul)
}

function populatePlayer(titleMap, artist, album) {
  var music = []
  titleMap.forEach(function (value, key) {
    music.push({
      title: key,
      author: artist,
      url: value[0],
      pic: value[1]
    })
  })

  var ap = new APlayer({
    autoplay: true,
    music: music
  });

  ap.on('play', function () {
    count = 0
    titleMap.forEach(function (value, title) {
      if (count == ap.playIndex) {
        document.title = title + " - " + artist + " - " + album

        // stack overflow code to change favicon
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = value[1];
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      count++
    })
  })
}
