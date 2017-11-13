const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	console.log('인사이드 GET /users callback')
	console.log(`User authenticated? ${req.isAuthenticated()}`)

	console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
	console.log(`req.user: ${JSON.stringify(req.user)}`);

	if(req.isAuthenticated()) {
		console.dir(req.user);
		res.send(req.user); // Don't need stringify because firefox can parse it
	} else {
		console.log('you are not logged\n');
		res.redirect('/login');
	}
});

module.exports = router;
