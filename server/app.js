const express = require('express');

const path = require('path');
// const morgan = require('morgan');

const app = express();

app.use(express.json());
// serve a static file
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.use('/', api);
// routes
// app.use('/planets', planetsRouter);
// app.use('/launches', launchesRouter);

module.exports = app;
