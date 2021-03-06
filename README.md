# Stream Yourself

*stream music you own*

![Screenshot](https://i.imgur.com/RPXpMHm.png)

## Features

- automatically update from watch directory
- uses html5 music player (supports `.mp3`, `.wav`, `.flac`, `.ogg`, ect.)
- keyboard navigation (arrow keys)
- search/filter
- queue song/album
- skip song
- `spacebar` play/pause

## Installation

1. Install [backend](https://github.com/jackloughran/stream-yourself-service)
2. Create serveDir & watchDir: *each with one line containing the watch dir (where the music is stored) and the serve dir (a sym-link to the watch dir from a servable dir like `www/`*
2. Run backend
3. Install frontend *(this)*
4. Serve frontend

## Bugs

- album selection page second row doesn't scroll
- album art sometimes is pulled from other photos in the same directory
- album art sometimes repeats itself
- song name in corner doesn't wrap
- no way to upload your own art
- no way to go back to album selection page
- browser back doesnt work 