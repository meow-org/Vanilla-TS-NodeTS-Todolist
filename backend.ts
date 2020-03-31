const http = require('http'); // Import Node.js core module

const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

const server = http.createServer(function (request, response) {   //create web server

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    const dummyTodos = {'12312':'enjoy your day in the quarantine',
                        '123123':'get the basics of typescript',
                        '12312312312':'make a nice backend'}

    if (request.url == '/') { //check the URL of the current request
        console.log('there was a request to port 5000 of localhost');
        // set response header
        response.writeHead(200, { 'Content-Type': 'application/json' }); 
        
        // set response content    
        response.write(JSON.stringify(dummyTodos)); 
        response.end();

    } else if (request.url == '/data') { 
        //check the URL of the current request
        console.log('there was a request to data at port 5000 of localhost');
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: "Hello data"}));  
        response.end();  
    }else
        response.end('Invalid Request!');
    }
);

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')