/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-curly-newline */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');
const mongoose = require('mongoose');
const { EOL } = require('os');
const fs = require('fs');
const url = require('url');
const menuTamplate = require('./helpers/menu');

const CWD = process.cwd();

const rootDir = CWD;

const jsreport = require('jsreport')({
  rootDirectory: rootDir
});

const events = require('./events');

require('@electron/remote/main').initialize();

// 'mongodb://cvm:cvmdb@localhost:27017/compta?authSource=compta'

async function dbConnect() {
  await mongoose.connect(
    'mongodb://admin2:ndandani721@localhost:27017/bergame?authSource=admin',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}

dbConnect().catch((err) => console.log(err));

function createWindow() {
  const screenElectron = electron.screen;
  const display = screenElectron.getPrimaryDisplay();
  const dimensions = display.workAreaSize;
  const win = new BrowserWindow({
    width: parseInt(dimensions.width * 0.85, 10),
    height: parseInt(dimensions.height * 0.85, 10),
    frame: false,
    icon: url.format(path.join(__dirname, '/images', '/icons', '/bergame.png')),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadURL(
    isDev
      ? `file://${path.join(__dirname, '../build/index.html')}`
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // eslint-disable-next-line prefer-arrow-callback
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTamplate));
  events();
  // eslint-disable-next-line no-use-before-define
  // jsreportProcess();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function appLog(level, message) {
  const origMsg = message;

  // eslint-disable-next-line no-param-reassign
  message += EOL;

  if (level === 'info') {
    console.log(origMsg);
    fs.appendFileSync(path.join(CWD, 'app-info.log'), message);
  } else if (level === 'error') {
    console.error(origMsg);
    fs.appendFileSync(path.join(CWD, 'app-error.log'), message);
  }
}

// eslint-disable-next-line no-unused-vars
async function jsreportProcess() {
  try {
    // we defer jsreport initialization on first report render
    // to avoid slowing down the app at start time
    // eslint-disable-next-line no-underscore-dangle
    if (!jsreport._initialized) {
      await jsreport.init();
      appLog('info', 'jsreport started');
    }

    appLog('info', 'rendering report..');

    try {
      const resp = await jsreport.render({
        template: {
          content: fs
            .readFileSync(path.join(__dirname, './report.html'))
            .toString(),
          engine: 'handlebars',
          recipe: 'chrome-pdf'
        },
        data: {
          rows: [
            {
              name: 'electron',
              description:
                'Build cross platform desktop apps with JavaScript, HTML, and CSS'
            },
            {
              name: 'jsreport',
              description:
                'Innovative and unlimited reporting based on javascript templating engines and web technologies'
            }
          ]
        }
      });

      appLog('info', 'report generated');

      fs.writeFileSync(path.join(CWD, 'report.pdf'), resp.content);

      const pdfWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
          plugins: true
        }
      });

      pdfWindow.loadURL(
        url.format({
          pathname: path.join(CWD, 'report.pdf'),
          protocol: 'file'
        })
      );
    } catch (e) {
      appLog('error', `error while generating or saving report: ${e.stack}`);
    }
  } catch (e) {
    appLog('error', `error while starting jsreport: ${e.stack}`);
  }
}

process.on('uncaughtException', (err) => {
  appLog('error', `Uncaught error: ${err.stack}`);
  throw err;
});
