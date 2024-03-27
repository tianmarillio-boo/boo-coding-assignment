const express = require('express');

require('./config/database');
require('express-async-errors');

const errorHandler = require('./errors');

const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/', require('./routes/profile')());

// error handler
app.use(errorHandler);

// start server
const server = app.listen(port);
console.log('Express started. Listening on %s', port);
