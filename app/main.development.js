// @flow
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';
import http from 'http';
import path from 'path';
import {spawn} from 'child_process';
import kill from 'tree-kill';

const options = {
  method: 'HEAD',
  host: '127.0.0.1',
  port: 43110,
  path: '/'
};

let mainWindow = null;
let zeronet = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    // TODO: Use async interation statement.
    //       Waiting on https://github.com/tc39/proposal-async-iteration
    //       Promises will fail silently, which isn't what we want in development
    return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .catch(console.log);
  }
};

const getStatus = (url) => {
  return new Promise((resolve, reject) => {
    let req = http.request(options, (res) => {
      resolve(res.statusCode);
  	});
    req.on('error', (e) => {
      reject(e);
    });
    req.end();
  });
};

const rejectDelay = (reason) => {
	return new Promise((resolve, reject) => {
    setTimeout(reject.bind(null, reason), 2000);
  });
};

const serverIsAlive = async () => {
  return new Promise((resolve, reject) => {
    let p = Promise.reject();

    for (let i=0; i<5; i++) {
      p = p.catch(getStatus).catch(rejectDelay);
    }

    p.then((status) => {
      if (status < 400) {
        resolve(true);
      }
      reject(status < 400);
    }).catch((err) => {
      reject(false);
    });
  });
}

const startZeroNet = async () => {
  let spawned = false

  let python, zeropath
  if (process.env.NODE_ENV === 'production') {
    if (process.platform === 'win32') {
      python = path.resolve(__dirname + '/Python/python.exe')
    } else {
      python = path.resolve(__dirname + '/Python/python')
    }

    zeropath = path.resolve(__dirname + '/zeronet.py')
  } else {
    if (process.platform === 'win32') {
      python = path.resolve(__dirname + '/../build/win/ZeroBundle/Python/python.exe')
    } else if (process.platform === 'darwin') {
      python = path.resolve(__dirname + '/../build/mac/ZeroBundle/Python/python')
    } else {
      python = path.resolve(__dirname + '/../build/linux/ZeroBundle/Python/python')
    }

    zeropath = path.resolve(__dirname + '/../ZeroNet/zeronet.py')
  }

  zeronet = spawn(python, [zeropath, '--homepage', '1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'], {
    detached: true,
    stdio: ['ipc']
  })

  zeronet.on('close', (err) => {
    console.log('ZeroNet is Not Aviable: ' + err);
  });

  return serverIsAlive()
      .catch((err) => {
        console.log('ZeroNet is Not Recheable: ' + err);
        process.exit(1);
      });
}

app.on('ready', async () => {
  await installExtensions();
  await startZeroNet();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      preload: path.resolve(path.join(__dirname, 'preload.js'))
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:43110`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
   	mainWindow.webContents.insertCSS('.notification {transform: scale(1) !important;}')
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

app.on('before-quit', () => {
  kill(-zeronet.pid, 'SIGINT', function(err) {
    console.log(err)
  })
});

app.on('window-all-closed', () => {
  app.quit();
});
