const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev.js');

const port = process.env.PORT || 4000;

const app = express();

const devServerEnabled = false;


if (devServerEnabled) {
  config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('./public/view'));
app.use('/css', express.static('./src/view/css'));
app.use('/detected-images', express.static('./public/tmp'));
app.use('/api/v1/detect', require('./public/server/detect').default);

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
