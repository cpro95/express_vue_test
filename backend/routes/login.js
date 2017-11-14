const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next){
	console.log('인사이드 GET /login 콜백 안에서')
	console.log(req.sessionID);
	if(req.isAuthenticated()) {
		res.send(`GET Method: You're already logged as id : ${req.user.id}\n`);
	} else {
		res.render('login', {title: 'hey', message: 'Hello there!'});
	}
});

router.post('/', function(req, res, next){
	console.log('인사이드 POST /login 콜백 안에서');

	passport.authenticate('local', (err, user) => {
		console.log('Inside passport.authenticate() callback');
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
		console.log(`req.user: ${JSON.stringify(req.user)}`);

		//if(info) { return res.send(info.message); }
		if(err) { return next(err); }
		if(!user) { return res.redirect('/login'); }

		req.login(user, (err) => {
			console.log('Inside req.login() callback');
			console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
			console.log(`req.user: ${JSON.stringify(req.user)}`);

			if(err) { return next(err); }

			// when login authenticated
			return res.redirect('/users');
		})
	})(req, res, next);

});


module.exports = router;

