//const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');

const homeRouter = require('./routes/home');
const influenceurRouter = require('./routes/influenceur');
const entrepriseRouter = require('./routes/entreprise');
const adminRouter = require('./routes/admin');

/*var catalogRouter = require('./routes/catalog');*/

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());
//to parse "post" requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Router
app.use('/', homeRouter);
app.use('/influenceur',influenceurRouter);
app.use('/entreprise',entrepriseRouter);
app.use('/admin',adminRouter);
/*app.use('/', catalogRouter);*/

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Page non trouvée');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

let port = process.env.PORT;
if (port == null) {
  port = 8080;
}
app.listen(port);

