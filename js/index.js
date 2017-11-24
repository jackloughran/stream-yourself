var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://localhost:48001/api/list", true)
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var song = JSON.parse(xhr.responseText);
      makePlayer(song);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.send(null);

function makePlayer(songs) {
  console.log("Song: " + songs[0].loc)
  var ap = new APlayer({
    music: {                                                           // Required, music info, see: ###With playlist
              title: songs[0].title,                                          // Required, music title
              author: songs[0].artist,                          // Required, music author
              url: songs[0].loc,  // Required, music url
          }
  });
}
