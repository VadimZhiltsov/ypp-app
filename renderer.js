// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var ipc = require('electron').ipcRenderer;

document.querySelector('#video').innerHTML = "hahah"

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

ipc.on('play-new', function (event, videoId) {
  console.log(arguments);
    play(videoId);
});

window.onYouTubePlayerAPIReady = () => {

}

function play(videoId) {
  if (player) {
    player.destroy();
  }

  player = new YT.Player('video', {
    videoId: videoId,
    playerVars: { autoplay: 1, rel: 0, modestbranding: 1  },
  });
}

document.addEventListener('DOMContentLoaded', function () {
    ipc.send('dom-ready');
});
