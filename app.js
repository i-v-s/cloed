'use strict';

var express        = require('express');
var bodyParser     = require('body-parser');
var getRawBody     = require('raw-body');
var typer = require('media-typer');
var fs = require('fs');


//var cookieParser   = require('cookie-parser');
//var session        = require('express-session');
//var passport       = require('passport');
//var config		   = require('nconf');
//var requireTree    = require('require-tree');
//var log			   = require('winston');

//requireTree('./setup/');

var app = express();

//app.set('views', './views');
//app.set('view engine', 'jade');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(express.multipart());
//app.use(cookieParser());
//app.use(session({secret: 'secret', resave:true, saveUninitialized: true}));

//app.use(passport.initialize());
//app.use(passport.session());

//var routes = requireTree('./routes/');
//for(var x in routes) routes[x](app);

function raw(req, res, next)
{
	getRawBody(req, {
	    length: req.headers['content-length'],
	    limit: '1mb',
	    encoding: typer.parse(req.headers['content-type']).parameters.charset
	  }, function (err, string) {
	    if (err) return next(err)
	    	//console.log("str:", string);
	    	req.text = string
	    	next()
	  });
};

function save(req, res, next)
{
	fs.writeFile('./user/' + req.params.name, req.text, function (err) 
	{
  		if(err) return next(err);
  		//console.log('text:', req.text);
		res.json({result:true});
	});
}

function list(req, res, next)
{
	fs.readdir('./user', function(err, files)
	{
		if(err) return next(err);
		res.json({result:true, files: files});
	});
}

function index(req, res, next)
{
	fs.readdir('./user', function(err, files)
	{
		if(err) return next(err);
		res.redirect('/user/' + files.pop());
	});	
}

app.use('/user/', express.static('./user/'));
app.get('/list', list)
app.put('/user/:name', raw, save); // Сохранить проект 
app.get('/', index);

var port = 80;//config.get('express:port');
app.listen(port, function()
{
    //log.info('Application listen port', port);
});
