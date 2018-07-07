import { Message } from './../../shared/Messages/Message';
import { PlayerMessages } from './../../shared/Messages/PlayerMessages';
import {Router, Request, Response } from "express";
import * as express from "express";
var path = require('path');
import { Socket } from 'dgram';
import * as sio from 'socket.io';
import "../../shared/shared";
import "../../shared/ServerEntities/Player";
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

function Emit(socket:sio.Socket, message:Message)
{
  socket.emit(message.GetMessageType(), message);
}
function Broadcast(socket:sio.Socket, message:Message)
{
  socket.broadcast.emit(message.GetMessageType(), message);
}


// app.use(express.static('public'))
let io = sio(server);

io.on('connection', function (socket) //putting as a socket doesn't work- won't let you grab the ID
{
  
  console.log("socket class name: "+socket.constructor.name);
  console.log('a user connected with id: '+(socket as any).id);
  
  if(players.length>0)
    Emit(socket, new PlayerMessages.AddOtherPlayers(players));
    
  let player:PlayerMessages.Player= new PlayerMessages.Player(Math.random()*200, Math.random()*200, socket.id);
  players.push(player);

  console.log("Number of players: "+players.length);

  // socket.emit('message', 'can you hear me?', 1, 2, 'abc');
  // socket.emit('message', 'can you hear me2');

  // send the players object to the new player
  Emit(socket, new PlayerMessages.SelfFromServer(<PlayerMessages.Player>GetPlayerByID(socket.id)));
  //  socket.emit('SelfFromServer', players.get(socket.id));
  // update all other players of the new player
  Broadcast(socket, new PlayerMessages.AddNewPlayer(<PlayerMessages.Player>GetPlayerByID(socket.id)));
  //socket.broadcast.emit('AddNewPlayer', players.get(socket.id));

  socket.on('disconnect', function () 
  {
    console.log('user disconnected');
    // remove this player from our players object
    let pos:number = GetPlayerPosByID(socket.id);
    console.log("removing player with id: "+socket.id+", found at pos: "+pos);
    let player =players.splice(pos, 1);

    // players.delete(socket.id);
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);

    console.log("Number of players: "+players.length);
  });
  socket.on(PlayerMessages.Position.GetMessageType(),  (data:string)=>PositonRecieved(socket, JSON.parse(data)));

});
function PositonRecieved(socket:sio.Socket, data:JSON)
{
  // console.log("data: "+data+", data.x, y: "+data.x+", "+data.y);
  let message:PlayerMessages.Position =new PlayerMessages.Position().SetJSONObj(data);
  // console.log("pos recieved!");
  console.log("pos: "+message.x+", "+message.y);
  //so broadcast to everyone else
  Broadcast(socket, message);
}
 
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
 let players:PlayerMessages.Player[] = new Array();
 function GetPlayerByID(id:string)
 {
   let player:PlayerMessages.Player|null=null;
   for(let i:number=0;i<players.length;i++)
      if(players[i].id===id)
      {
        player=players[i];
        break;
      }
      return player;
 }
 function GetPlayerPosByID(id:string)
 {
   let pos:number=-1;
   for(let i:number=0;i<players.length;i++)
      if(players[i].id===id)
      {
        pos=i;
        break;
      }
      return pos;
 }
//let players:Map<string, PlayerMessages.Player> = new Map<string, PlayerMessages.Player>();//to have key be a string- using 'map' object type- like a dictionary //--cant send maps over socket IO, so just goign to use arrays instead