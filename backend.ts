interface TODOS {
  _id: string;
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
const server = http.createServer(function (request, response) {   //create web server

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');



    if (request.url == '/' && request.method === 'GET') { //check the URL of the current request
        console.log('there was a request to port 5000 of localhost');
        // set response header
        response.writeHead(200, { 'Content-Type': 'application/json' }); 
        // Get the documents collection
        let collection = db.collection('todos');
        // Find some documents
        let docs = [];
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
        //set response header
        response.writeHead(200); 
        response.end();

    }else if (request.url == '/' && request.method === 'DELETE') { 
        //check the URL of the current request
        let data = [];
        request.on('data', chunk => {
          data.push(chunk);
        })
        
        request.on('end', () => {
          console.log(data);
          let idToDelete:string = data.toString();
          let collection = db.collection('todos');
          collection.remove( { _id:idToDelete }, true )
          console.log(idToDelete, "is removed from collection");
        })
        //set response header
        response.writeHead(200); 
        response.end();

    }else if (request.url == '/' && request.method === 'PATCH') { 
      //check the URL of the current request
      let data = [];
      request.on('data', chunk => {
        data.push(chunk);
      })
      
      request.on('end', () => {
        console.log(data);
        let updatedTodo:TODOS = JSON.parse(data.toString());
        let collection = db.collection('todos');
        collection.updateOne( {_id : updatedTodo._id}, {$set:{todo: updatedTodo.todo}});
        console.log(updatedTodo, "was modified in collection");
      })
      //set response header
      response.writeHead(200); 
      response.end();

    }else
        response.end('Invalid Request!');
    }
);

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')