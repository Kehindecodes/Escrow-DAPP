const express = require('express');

const path = require('path');
// const morgan = require('morgan');
const escrowRouter = require('./escrow.route');
const app = express();

app.use(express.json());
// serve a static file
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.use('/', api);
// routes;
app.use('/escrows', escrowRouter);

module.exports = app;
