const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron/main');
let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017/';

const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('add', (event, args) => {
  MongoClient.connect(url, (err, dbo) => {
    if (err) throw err;
    let db = dbo.db('scoredb');
    console.log(args);
    db.collection('scorecard').insertOne(args);
    // dbo.close()
  });
});

ipcMain.on('getScores', (event, args) => {
  MongoClient.connect(url, (err, dbo) => {
    if (err) throw err;
    let db = dbo.db('scoredb');

    db.collection('scorecard')
      .find()
      .sort({ score: -1 })
      .toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        setTimeout(() => {
          event.reply('update', result);
        }, 1000);
      });

    // dbo.close()
  });
});

ipcMain.on('reset', (event, args) => {
  MongoClient.connect(url, (err, dbo) => {
    if (err) throw err;
    let db = dbo.db('scoredb');

    db.collection('scorecard').remove({});

    // dbo.close()
  });
});
