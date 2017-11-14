const express = require('express');
const router = express.Router();
//const movies = require('../movies.json');
const sqlite3 = require('sqlite3').verbose();

// middleware - check whether authenticated?
function checkAuthentication(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		console.log('Not log in');
		res.redirect('/login');
	}
}

var db;
var sql = `select * from movie where c05 > 8.00 and c07 > 2014`;

// open the database connection
function db_open() {
	// open the database
	db = new sqlite3.Database('./MyVideos99.db',sqlite3.OPEN_READONLY,(err) => {
	if(err) {
		return console.error(err.message);
	}
	console.log('Connected to the myVideos99 databasse');
	});
}

// close the database connection
function db_close() {
	db.close((err) => {
		if(err) {
			return console.error(err.message);
		}
		console.log('Close the database connection.');
	});
}

router.get('/', checkAuthentication, function(req, res, next){

	if(Object.keys(req.query).length === 0) {
		// no query	
	} else {
		// parse search query to db sql
		const query = Object.keys(req.query);
		// sql = `select * from movie where c00 like '%${req.query.name}%'`; 

		sql = `select * from movie where`;
		query.map(function(item){
			if(item === 'name') {
				if(sql.slice(-5) != 'where') sql += ` and `;
				sql += ` c00 like '%${req.query[item]}%'`; 
			}
			if(item === 'year') {
				if(sql.slice(-5) != 'where') sql += ` and `;
				sql += ` c07 >= ${req.query[item]}`; 
			}
			if(item === 'rating') {
				if(sql.slice(-5) != 'where') sql += ` and `;
				sql += ` c05 >= ${req.query[item]}`;
			}
		});
		console.log(sql);
	}

	db_open();

	db.all(sql, [], (err, movies) => {
		if(err) {
			throw err;
		}
		// movies.c08,c20 is xml type
		// movies is array
		movies.forEach(function(row){
				const parser = new require('xml2js').Parser();

				if(row.c08 != '')
				parser.parseString(row.c08, function(err, result){
					// replacing preview link to movies.c08
						row.c08 = result.thumb.$.preview;
				});

				if(row.c20 != '')
				parser.parseString(row.c20, function(err, result){
					// replacing preview link to movies.c20
						row.c20 = result.fanart.thumb[0].$.preview;
				});
			});
		if(Object.keys(movies).length === 0 ) {
			res.send(`No data found`);
		} else {
			res.send(movies);
		}
		});

	db_close();
});

router.get('/:id',checkAuthentication, function(req, res, next){

	// parse sql query or sql params
	var id = parseInt(req.params.id, 10);
	sql = `select * from movie where idMovie = ${id}`;

	// open the database
	db_open();

	db.all(sql, [], (err, movie) => {
		if(err) {
			console.log(err);
			throw err;
		}
		
		// movie.c08,c20 is xml type
		// movie is array
		movie.forEach(function(row){
				const parser = new require('xml2js').Parser();
			if(row.c08 != '')
				parser.parseString(row.c08, function(err, result){
					// replacing preview link to movies.c08
					row.c08 = result.thumb.$.preview;
				});
			if(row.c20 != '')
				parser.parseString(row.c20, function(err, result){
					// replacing preview link to movies.c20
					row.c20 = result.fanart.thumb[0].$.preview;
				});
			});

		if(Object.keys(movie).length === 0 ) {
			res.send(`No data found : id = ${id}`);
		} else {
			res.send(movie);
		}
	});

	//close the database
	db_close();
});


module.exports = router;
