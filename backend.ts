interface TODOS {
  id: string;
  todo: string;
}

const http = require('http'); // Import Node.js core module

const MongoClient = require('mongodb').MongoClient //we need this to connect to the database
  , assert = require('assert');
// Connection URL
const mongoDBUrl:string = 'mongodb://localhost:27017/';

let db; // global variable to hold the connection

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
    if(err) { console.error(err) }
    db = client.db('todos') // once connected, assign the connection to the global variable
})


// Use connect method to connect to the Server



//TODELETE!
//these are dummy data to use to test our app
/*const dummyTodos = {'12312':'enjoy your day in the quarantine',
'123123':'get the basics of typescript',
'12312312312':'make a nice backend'}*/

const server = http.createServer(function (request, response) {   //create web server

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');



    if (request.url == '/' && request.method === 'GET') { //check the URL of the current request
        console.log('there was a request to port 5000 of localhost');
        // set response header
        response.writeHead(200, { 'Content-Type': 'application/json' }); 
        // Get the documents collection
        let collection = db.collection('todos');
        // Find some documents
        let docs = []
        collection.find().toArray().then(data => {
          console.log(data); docs = data;})
          .then(()=> {   
           console.log(docs);
          response.write(JSON.stringify(docs)); 
          response.end();
          }
  );
        // set response content    

    }else if (request.url == '/' && request.method === 'POST') { 
        //check the URL of the current request
        let data = [];
        request.on('data', chunk => {
          data.push(chunk);
        })
        
        request.on('end', () => {
          console.log(data);
          let newTodo:TODOS = JSON.parse(data.toString());
          let collection = db.collection('todos');
          collection.insertOne(newTodo);
          console.log(newTodo, "is added to collection");
        })
        console.log('there was a request to port 5000 of localhost');


        //set response header
        response.writeHead(200); 
        //Here we need to add acquired from client json to our mongodb
        // set response content    
        //response.write(JSON.stringify(dummyTodos)); 
        response.end();
    }else if (request.url == '/' && request.method === 'DEL') { 
        //check the URL of the current request
        console.log('there was a request to port 5000 of localhost');
        // set response header
        //response.writeHead(200, { 'Content-Type': 'application/json' }); 
        //Here we need to delete JSON specified by client
        // set response content    
        //response.write(JSON.stringify(dummyTodos)); 
        response.end();

    } else if (request.url == '/data') { 
        //check the URL of the current request
        console.log('there was a request to data at port 5000 of localhost');
        // set response header
        response.writeHead(200, { 'Content-Type': 'application/json' }); 
        
        // set response content    
        response.end();
    }else
        response.end('Invalid Request!');
    }
);

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')