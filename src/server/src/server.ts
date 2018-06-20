import {Router, Request, Response } from "express";
import * as express from "express";
var path = require('path');
import { Socket } from 'dgram';
import * as sio from 'socket.io';
import "../../shared/shared";
import {Shared} from "../../shared/shared";

console.log("firing up express1");
//var express = require('express');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);

let shared = new Shared();
shared.Alert("From Server.ts");



__dirname = path.resolve();
let dir_name = path.join(__dirname, "./dist/client/");
console.log("Server: __dirname: "+dir_name);
 
//to allow static files to be served:
app.use(express.static(dir_name));



app.get('/', function (req:Request, res:Response) {
  // res.sendFile(__dirname + '/index.html');
  res.sendFile(dir_name + '/index.html');
});



// app.use(express.static('public'))
let io = sio(server);

io.on('connection', function (socket) //putting as a socket doesn't work- won't let you grab the ID
{
  
  console.log("socket class name: "+socket.constructor.name);
  console.log('a user connected with id: '+(socket as any).id);
  
  if(players.length>0)
    socket.emit('AddOtherPlayers', players);
    
  let obj={
    x:Math.random()*200,
    y:Math.random()*200,
    id:socket.id
  };
  players[socket.id]=obj;

  socket.emit('message', 'can you hear me?', 1, 2, 'abc');
  socket.emit('message', 'can you hear me2');

  // send the players object to the new player
   socket.emit('AddSelf', players[socket.id]);
// update all other players of the new player
 socket.broadcast.emit('AddNewPlayer', players[socket.id]);

  socket.on('disconnect', function () 
  {
    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

});
 
server.listen(8081, function () {
  console.log(`Listening 321 on ${server.address().port}`);

  //for browser-refresh
  if (process.send) 
  {
    //process.send('online');
    process.send({ event:'online', url:'http://localhost:8081/' });

    console.log("SERVER: variable needed for index: "+process.env.BROWSER_REFRESH_URL);
  }
});

//send browser refresh variable to front end
app.get('/BROWSER_REFRESH_URL', function(req, res) {
  res.send(process.env.BROWSER_REFRESH_URL);
});

//server variables
let players:any = {};