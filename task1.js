/* 
 * Primarty file for the API
 *
 *
 */


 // Dependencies
 var http = require('http');
 var url = require('url');
 var config = require('./config');
 


 // Instantiate the HTTP server
 var httpServer = http.createServer(function(req,res){
 	unifiedServer(req,res);
 });

//Start HTTP server 
 httpServer.listen(config.httpPort, function(){
 	console.log('Server is listening on port ',config.httpPort);
 });


 // create unified server to work on both http and https request
 var unifiedServer = function (req, res){

 	// Get the URL and parse it
 	var parsedURL = url.parse(req.url, true);


 	// Fetch the actual path
 	var path = parsedURL.pathname;
 	var acrualPath = path.replace(/^\/+|\/+$/g,'');

 	// Fetch the querty string
 	var queryString = parsedURL.query;

 	// Request method
 	var method = req.method;

 	
	// Choose the handler this request goto if handler not found then go to the notFound handler
	var choosenHandler = typeof(router[acrualPath]) !== 'undefined' ? router[acrualPath]:handlers.notFound;

	// Construct the data object to send to the handler
	var data = {
 			'acrualPath' : acrualPath,
 			'queryString' : queryString,
 			'method' : method
 			
 		};

 	//Route the request to the specified handler 
 		choosenHandler(data,function(statusCode, payload){

 			//Use the status code callback by the handler and set the default value
 			statusCode = typeof(statusCode)=='number' ? statusCode : 200;

 			// Setup the payload data and set the default value
 			payload = typeof(payload) == 'object' ? payload : {};

 			//convert payload object to string
 			var payloadString = JSON.stringify(payload);

 			//return the response
 			res.setHeader('Content-Type','application/json');
 			res.writeHead(statusCode);
 			res.end(payloadString);

 			//return this response
 			console.log('Return response:',payloadString);

 		});	

 };


 //define the handlers
var handlers = {};


//user handler
handlers.hello = function (data, callback){
	// callback a http status code and payload object
	callback(406,{'Hello' : 'World'});

};

//Ping handler
handlers.ping = function (data, callback){
	callback(200);
};

//not fund handler
handlers.notFound = function (data, callback){
	callback(404,{'404' : 'not found'});
};

 // define a request router
 var router = {
 	'hello' : handlers.hello,
 	'ping' : handlers.ping
 }