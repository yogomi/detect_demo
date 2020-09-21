const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 32001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('./public/view'));

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof error.port === 'string'
    ? `Pipe ${error.port}`
    : `Port ${error.port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      throw error;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      throw error;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
