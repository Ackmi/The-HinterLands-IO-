//https://github.com/digitsensitive/phaser3-typescript/blob/master/src/games/asteroid/game.ts
///<reference path="phaser.d.ts" />
import * as Phaser from "phaser";

// import {} from "phaser"

// import {} from "socket.io";
// import * as sio from 'socket.io';
// import {Server, Socket, Client} from "socket.io";
//  import io from 'socket.io';
// import io = require('socket.io');

import {Test} from "./test"

import {Shared} from "../../shared/shared";

import {Map} from "./map";
import SocketComm from './SocketComm';
// import { Server } from 'socket.io';

import Player from "../../shared/Entities/Player";
import { PlayerMessages } from '../../shared/Messages/PlayerMessages';


// const socket:any = io('http://localhost:8081');
//  var socket = io('http://localhost:8081');





export class MyScene extends Phaser.Scene
{
  map:Map;
  my_player:Player;
  cursors!:CursorKeys; //! tells typescript that we know it won't be null- that we'll assign a value to it later, and not to error out
  public players:Player[];

  constructor()
  {
    super({"key":"MyScene"});
    this.map = new Map(this);
    this.my_player= new Player();
    this.players= new Array();
    
    console.log("MyScene: constructor!");
  }
  init():void
  {
    console.log("MyScene: Init!");
  }
//so all these functions are in a scene type object- not a game type object
  preload() 
  {
    console.log("MyScene: preload");
     this.map.preload();
    this.my_player.Preload(this);
    console.log("MyScene: preload finished");
  }

  create() 
  {
    
    console.log("MyScene: Create!");
    this.map.create();
    this.my_player.CreatePlayer(this, this.map.tile_size);
    console.log("Player created");

    console.log("camera BEFORE going to follow player");
    this.cameras.main.setBounds(0,0, this.map.world_width_px, this.map.world_height_px);
    this.cameras.main.startFollow(this.my_player.sprite);
    console.log("camera going to follow player");


    game.socket_comm.Connect(this);
  }

  update(time:number, delta:number) 
  {
    delta=delta/1000;
    // console.log("MyScene: update: "+delta);

    let down:Phaser.Input.Keyboard.Key=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    let up:Phaser.Input.Keyboard.Key=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    let left:Phaser.Input.Keyboard.Key=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    let right:Phaser.Input.Keyboard.Key=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    let space:Phaser.Input.Keyboard.Key=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    let speed:number=100*delta;
   
      // console.log("ANIM KEY: "+this.my_player.anims.currentAnim.key);
    if (space.isDown||this.my_player.sprite.anims.currentAnim!=null&&this.my_player.sprite.anims.currentAnim.key==="attack_down") 
    {
      this.my_player.sprite.anims.play('attack_down', true);
      if(this.my_player.sprite.anims.getProgress()===1&&!space.isDown)
        this.my_player.sprite.anims.play('idle', true);
    }
    
      
  
    let pos_changed:boolean=false;
    if (down.isDown) 
    {
      this.my_player.y+=speed;
      this.my_player.anims.play('down', true);
      pos_changed=true;
    }
    else if (up.isDown) 
    {
      this.my_player.y-=speed;
      this.my_player.anims.play('up', true);
      pos_changed=true;
    }

    if (left.isDown) 
    {
      this.my_player.x-=speed;
      this.my_player.anims.play('left', true);
      pos_changed=true;
    }
    else if (right.isDown) 
    {
      this.my_player.x+=speed;
      this.my_player.anims.play('right', true);
      pos_changed=true;
    }
    else if(!down.isDown&&!up.isDown&&!space.isDown&&this.my_player.anims.currentAnim!=null&&this.my_player.anims.currentAnim.key!=="attack_down")
    {
      this.my_player.anims.play('idle', true);
    }

    

    if(this.my_player.x<0)
      this.my_player.x=0;
    else if(this.my_player.x+this.my_player.width>this.map.world_width_px)
      this.my_player.x=this.map.world_width_px-this.my_player.width;

    if(this.my_player.y<0)
      this.my_player.y=0;
    else if(this.my_player.y+this.my_player.height>this.map.world_height_px)
      this.my_player.y=this.map.world_height_px-this.my_player.height;

      if(pos_changed)
      {
        //send position to server
        let message:PlayerMessages.Position = new PlayerMessages.Position(this.my_player.x, this.my_player.y, this.my_player.id);
        console.log("sending message type1: "+message.GetMessageType()+", content: "+message.GetJSONObj());
      
        game.socket_comm.Emit(message.GetMessageType(), message.GetJSONObj());
        game.socket_comm.Emit("hi", {nothing:"here"});
      }
  }
}
// let my_scene:MyScene = new MyScene();



var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  backgroundColor: "#0000FF",
  pixelArt: false,
  antialias: true,
  /*scene: {
    preload: preload,
    create: create,
    update: update
  } */
  scene: [MyScene]
};

let test = new Test();
test.Alert("Checking importing files");

let shared = new Shared();
shared.Alert("Shared from Game.ts");

// var game = new Phaser.Game(config);
export class Game extends Phaser.Game 
{
  self:Game;
  public socket_comm:SocketComm;
  constructor(config: GameConfig) 
  {

    super(config);
    console.log("Game constructor called!");

    this.self=this;
  

    window.addEventListener('resize', ()=>this.Resize());//have to do an arrow function to pass "this" to resize- or it thinks "this" is window, since that is the event listener
    this.Resize();
    this.socket_comm = new SocketComm(this);

  //  this.canvas.focus(); 
    
    //this.device.fullscreen.request
  }
  Resize() 
  {
    let canvas:HTMLCanvasElement = this.canvas;
    let width:number = window.innerWidth;
    let height:number = window.innerHeight;
   
    //if we want it to fit the window exactly, but scale
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    //if we want to keep our ratio, but leave gaps on the side
    // var canvas = this.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) 
    {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } 
    else 
    {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }

    //should also center the canvas then
    // canvas.style.margin="auto";
    // canvas.style.display="block";
    canvas.style.cssText=canvas.style.cssText+`
    margin:auto;
    display:block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    `;

    //lets also request full screen
    // if(canvas.requestFullscreen)
    //   canvas.requestFullscreen();
    //   console.log("Request Full Sceen: "+canvas.requestFullscreen);
  }
}
let game:Game;
window.onload = () => {
  game = new Game(config);
};


