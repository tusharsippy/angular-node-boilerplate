/**
 * app.js file is used to set all major configuration for our node application.
 * Static path, bodyParser, request logging, api's and serving index.html(index file for our
 * project) has been set in this file.
 */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const cwd = process.cwd();
const app = express();

// serving static contents from public_html folder
app.use('/', express.static(path.join(cwd, '/frontend/public_html')));

// use morgan to check every request
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// test api to check if api is working
app.use('/ok', (req, res) => {
    res.send('ok');
});

// route all request other than api's and static files to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(cwd, '/frontend/public_html/', 'index.html'));
});

module.exports = app