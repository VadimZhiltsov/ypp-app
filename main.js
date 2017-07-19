const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const http = require('http')
const express = require('express')
const windowStateKeeper = require('electron-window-state');

let mainWindow
let mainWindowState



function createWindow () {
  return new Promise((resolve) => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 450,
      'x': mainWindowState.x,
      'y': mainWindowState.y,
      'width': mainWindowState.width,
      'height': mainWindowState.height,
      frame: false,
      show: false,
      title: 'Portable youtube player',
      titleBarStyle: 'hidden',
      icon: path.join(__dirname, 'youtube.png')
    })



    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    //mainWindow.setOverlayIcon(path.join(__dirname, 'youtube.ico'))


    mainWindow.setAlwaysOnTop(true);

    mainWindow.setAspectRatio(16/9);

    mainWindow.on('closed', function () {
      mainWindow = null
    });

    mainWindow.once('ready-to-show', () => {
      resolve();
    })
  })
}

app.on('ready', () => {
    mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 450
    });

    createWebServer();
    createWindow();

    mainWindowState.manage(mainWindow);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


async function playNew(videoId) {
  console.log('CREATING');

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  mainWindow.webContents.send('play-new', videoId);
}


function createWebServer() {
  const ws = express()

  ws.get('/play/:videoId', function (req, res) {
    playNew(req.param('videoId'));
    res.send('OK!');
  })

  ws.listen(3010, function () {
    console.log('Example app listening on port 3010!')
  })
}
