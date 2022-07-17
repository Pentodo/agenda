var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var { flash } = require('express-flash-message');

require('dotenv').config();

var indexRouter = require('./routes/index');
var entrarRouter = require('./routes/entrar');
var contatosRouter = require('./routes/contatos');

var app = express();

// mongodb setup
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
  secret: 'FA6sQ$UZc&%zzR6fo0^C',
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({ client: mongoose.connection.getClient() }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// flash messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// session locals
app.use(async (req, res, next) => {
  res.locals.email = req.session.email;
  res.locals.messages = req.session.flashMessage ? await req.consumeFlash('messages') : [];
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/entrar', entrarRouter);
app.use('/contatos', contatosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;

  // set locals, only providing error in development
  res.locals.title = `Error ${status}`;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status);
  res.render('error');
});

module.exports = app;
