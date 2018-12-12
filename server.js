// npm init
// npm install <package> --save
var express = require('express');
var bodyParser = require("body-parser");
var util = require('util');
var request = require('request');
var pdf = require('html-pdf');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var htmlEncode = require('htmlencode');
htmlEncode.EncodeType = 'numerical';

// console.log('testApp');
// console.log('-------');

// // htmlencode test
// var html = '<h1>Welcome</h1>';
// var htmlEncoded = htmlEncode.htmlEncode(html);
// console.log(html);
// console.log(htmlEncoded);

// var bulletin_Dsc = 'desc';

// var exp=/^[\x20-\x7E\s\u2018\u2019\u201C\u201D\u2010-\u2014]+$/; // covers from ascii-x20 to \x7E, tab+whitespace,
// var allowedDesc=exp.test(bulletin_Dsc);
// var check1=(bulletin_Dsc.toLowerCase().indexOf('<script>')>-1)?true:false;
// var check2=(bulletin_Dsc.toLowerCase().indexOf('</script>')>-1)?true:false;

// console.log('bulletin_Dsc: ' + bulletin_Dsc);
// console.log();
// console.log('allowedDesc: ' + allowedDesc);
// console.log('check1: ' + check1);
// console.log('check2: ' + check2);
// console.log();

// if(bulletin_Dsc.length > 10000 || !allowedDesc  ||check1 || check2){
//     console.log('Status: Fail');
// } else {
//     console.log('Status: Pass');
// }

app.get('/', function (req, res) {
    res.send('test 123');
 });

 app.get("/weather/:city/:count", (req, res, next) => {
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
        res.send(body);
    });    
});

app.get("/test", (req, res, next) => {
    util.log('test request started ...');

    var x = {
        "employees": [
            {
                "firstName": "John",
                "lastName": "Doe"
            },
            {
                "firstName": "Anna",
                "lastName": "Smith"
            },
            {
                "firstName": "Peter",
                "lastName": "Jones"
            }
        ]
    }

    res.send(x);


    //util.log('city: ' + req.params.city);
    //util.log('days: ' + req.params.count);
    
    //console.log("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=c81efb4703a5b8a67e164eb272a8f462&units=metric&&cnt=" + req.params.count + "&q=" + req.params.city);
    
    // request.get("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=c81efb4703a5b8a67e164eb272a8f462&units=metric&&cnt=" + req.params.count + "&q=" + req.params.city, (error, response, body) => {
    //     if(error) {
    //         util.log('Weather request ERROR!');
    //         return console.dir(error);
    //     }
    //     util.log('Weather request SUCCESS!');
    //     res.send(body);
    // });    
});

app.post("/api/createpdf", (req, res, next) => {
    util.log('pdf test request started ...');

    var dateTimeLog = req.body.dateTimeLog;

    console.log('-----');
    console.log(dateTimeLog);
    console.log('-----');

    var x = "pdf test"

    var html = x + dateTimeLog;
    var finalOptions = "";

    writeToPdf(html, finalOptions, function(err, stream) {
        if (err) return res.status(500).send(err);
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


 
 var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("test webserver listening at http://%s:%s", host, port)
 });