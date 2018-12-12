var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var util = require('util');
var pdf = require('html-pdf');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
   res.send('hi');
})

// test
//app.get("/weather", (req, res, next) => {
//    console.log('Weather request started (default) ...');
//    request.get("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=c81efb4703a5b8a67e164eb272a8f462&cnt=2&q=Ballarat", (error, response, body) => {
//        if(error) {
//            util.log('Weather request ERROR!');
//            return console.dir(error);
//        }
//        util.log('Weather request SUCCESS!');
//        res.send(body);
//    });    
//});

// for a given city and count
app.get("/weather/:city/:count", (req, res, next) => {
    //console.log(new Date);
    util.log('Weather request started ...');
    util.log('city: ' + req.params.city);
    util.log('days: ' + req.params.count);
    
    console.log("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=c81efb4703a5b8a67e164eb272a8f462&units=metric&&cnt=" + req.params.count + "&q=" + req.params.city);
    
    request.get("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=c81efb4703a5b8a67e164eb272a8f462&units=metric&&cnt=" + req.params.count + "&q=" + req.params.city, (error, response, body) => {
        if(error) {
            util.log('Weather request ERROR!');
            return console.dir(error);
        }
        util.log('Weather request SUCCESS!');
        //util.log('New Update!');
        res.send(body);
    });    
});

app.get("/api/testdata", (req, res, next) => {
    util.log('test request started ...');

    var x = {"Date": new Date(), "Data": "some test data"};
    
    res.send(x);
});    

app.post("/api/createpdf", (req, res, next) => {
    var data = req.body;
    
    util.log(data);
    
    util.log('pdf test request');

    var x = "html-pdf test<hr /><h2>This is some html</h2>";

    var html = x;
    var finalOptions = "";

    writeToPdf(html, finalOptions, function(err, stream) {
        if (err) return res.status(500).send(err);
        util.log("success!");
        stream.pipe(res);
    });    

});

// code from project
function writeToPdf(html, options, callback) {
	//logger.debug('########## html = ' + html);
	if (html.indexOf('<script') == 1 || html.indexOf('<SCRIPT') == 1) {
		//logger.debug('error - html containig malicious script tag');
		//return res.status(500).send('error - html containig malicious script tag');
		return callback('html containing malicious script tag');
	}

	pdf.create(html, options).toStream(callback);
}

// init
var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("\u001b[2J\u001b[0;0H");
   console.log("WeatherAPI app listening at http://%s:%s", host, port)
})