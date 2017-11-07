const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const bcrypt = require('bcrypt-nodejs');


passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		session: true,
		passReqToCallback: false,
	},
	(email, password, done) => {
		console.log('인사이드 로컬 스트래티지 콜백');
		// here is where you make a call to the database
		// to find the user based on their username or email address
		// for now, we'll just pretend we found that it was users[0]
		console.log(email);
		axios.get(`http://localhost:5000/users?email=${email}`)
			.then(res => {
				const user = res.data[0]
				if (!user) {
					return done(null, false, { message: 'Invalid credentials.\n' })
				}
				if(!bcrypt.compareSync(password, user.password))  {
					return done(null, false, { message: 'Invalid credentials.\n' })
				}
				return done(null, user);
			})
			.catch(error => done(error));
		}
));

passport.serializeUser((user, done) => {
	console.log('인사이드 시리얼라이즈유저 콜백, 유저아이디는 세션 파일 스토어에 저장되었음');
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
		console.log('디시리얼라이즈 콜백 안입니다.');
		console.log(`세션 파일 스토어에 있는 유저 아이디 : ${id}`);

		axios.get(`http://localhost:5000/users/${id}`)
		.then(res => done(null, res.data))
		.catch(error => done(error, false));
});

const index = require('./routes/index');
const movies = require('./routes/movies');
const login = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add & configure middleware
app.use(session({
	genid: (req) => {
		console.log('세션 미들웨어 안에서 실행');
		console.log(`Request object sessionID from client: ${req.sessionID}`);
		return uuid();
	},
	store: new FileStore(),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/login', login);
app.use('/api/movies', movies);

app.get('/authrequired', (req, res) => {
	console.log('인사이드 GET /authrequired callback')
	console.log(`User authenticated? ${req.isAuthenticated()}`)
	if(req.isAuthenticated()) {
		res.send('you hit the authentication endpoint\n');
	} else {
		res.redirect('/');
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
