var net = require("net");
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  win.loadFile('./contents/index.html');
}

if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


/** Proxy routine */

var connectionSockets = [];
var struct_connection = {
  name: '',
  id: '',
  type: '',
  active: true,
  localPort: 9090,
  remoteHost: '127.0.0.1',
  remotePort: '3000',
  destinationURL: '',
  localSocket: null,
  remoteSocket: null,
  server: null
}

var localport = 9090;
var remotehost = 'localhost';
var remoteport = 3000;

// Test

struct_connection.server = net.createServer( function( socket ) {
  struct_connection.remoteSocket = new net.Socket();
  remotesocket.connect(remoteport, remotehost);
  
});

var server = net.createServer(function (localsocket) {
  var remotesocket = new net.Socket();

  remotesocket.connect(remoteport, remotehost);

  localsocket.on('connect', function (data) {
    console.log(">>> connection #%d from %s:%d",
      server.connections,
      localsocket.remoteAddress,
      localsocket.remotePort
    );
  });

  localsocket.on('data', function (data) {
    console.trace('Input:' + data);
    console.log("%s:%d - writing data to remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    var flushed = remotesocket.write(data);
    if (!flushed) {
      console.log("  remote not flushed; pausing local");
      localsocket.pause();
    }
  });

  remotesocket.on('data', function (data) {
    console.trace("Remote received: " + data)
    console.log("%s:%d - writing data to local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    var flushed = localsocket.write(data);
    if (!flushed) {
      console.log("  local not flushed; pausing remote");
      remotesocket.pause();
    }
  });

  localsocket.on('drain', function () {
    console.log("%s:%d - resuming remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.resume();
  });

  remotesocket.on('drain', function () {
    console.log("%s:%d - resuming local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.resume();
  });

  localsocket.on('close', function (had_error) {
    console.log("%s:%d - closing remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.end();
  });

  remotesocket.on('close', function (had_error) {
    console.log("%s:%d - closing local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.end();
  });

});

server.listen(localport);

console.log("redirecting connections from 127.0.0.1:%d to %s:%d", localport, remotehost, remoteport);

