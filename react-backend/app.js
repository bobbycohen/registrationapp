let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(express.static(path.join(__dirname, "client/build")));

//set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

//import models, { connectDb } from "./models";
//var models = require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.store = session({
  name: "session",
  secret: "regapprules",
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/"
  }
});
app.use(app.store);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*models.connectDb().then(async () => {
  app.listen(process.env.PORT, () => {
    console.log(`RegAppDB listening on port ${process.env.PORT}!`)
  });
});*/

module.exports = app;

//set PORT=3001 && node bin/www