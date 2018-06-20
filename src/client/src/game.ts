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


// const socket:any = io('http://localhost:8081');
//  var socket = io('http://localhost:8081');





export class MyScene extends Phaser.Scene
{
  map:Map;
  my_player:Player;

  // public guy!:Phaser.GameObjects.Sprite;
  // guy2!:Phaser.GameObjects.Sprite;

  cursors!:CursorKeys;
  constructor()
  {
    super({"key":"MyScene"});
    this.map = new Map(this);
    this.my_player= new Player();
    
    console.log("MyScene: constructor!");
  }
  init():void
  {
    console.log("MyScene: Init!");
  }
//so all these functions are in a scene type object- not a game type object
  preload() 
  {
    //console.log("Game: this in preload2 is: "+this.constructor);
    console.log("MyScene: preload");
     this.map.preload();
    //this.load.image("grass", "assets/images/grass_tile.jpg");

    this.my_player.Preload(this);

    //load the guy
    // this.load.image("guy", "assets/images/guy.png");

    // this.load.spritesheet('guy_anim', 'assets/images/character.png',  { frameWidth: 16, frameHeight: 32});
    // this.load.spritesheet('guy_attack', 'assets/images/guy_attack_32x32.png',  { frameWidth: 32, frameHeight: 32});

    

    console.log("MyScene: preload finished");
    
  }

  create() 
  {
    
    console.log("MyScene: Create!");
    this.map.create();

    //this.my_player = this.add.sprite(200, 200, 'guy').setOrigin(0,0);

    this.my_player.CreatePlayer(this, this.map.tile_size);
    console.log("Player created");


    // this.my_player = this.add.sprite(250, 200, 'guy_anim');//.setOrigin(0,0);
    // this.my_player.setDisplaySize(this.map.tile_size, this.map.tile_size*2);
    // this.anims.create({
    //   key: 'down',
    //   frames: this.anims.generateFrameNumbers('guy_anim', { start: 0, end: 3 }),
    //   frameRate: 10,
    //   repeat: -1
    //   });
    // this.anims.create({
    //   key: 'idle',
    //   frames: this.anims.generateFrameNumbers('guy_anim', { start: 5, end: 7 }),
    //   frameRate: 1,
    //   repeat: -1
    //   });
    //   this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('guy_anim', { start: 17, end: 20 }),
    //     frameRate: 10,
    //     repeat: -1
    //     });
    //   this.anims.create({
    //     key: 'up',
    //     frames: this.anims.generateFrameNumbers('guy_anim', { start: 34, end: 37 }),
    //     frameRate: 10,
    //     repeat: -1
    //     });
    //   this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('guy_anim', { start: 51, end: 54 }),
    //     frameRate: 10,
    //     repeat: -1
    //     });
    //     this.anims.create({
    //       key: 'attack_down',
    //       frames: this.anims.generateFrameNumbers('guy_attack', { start: 0, end: 3 }),
    //       frameRate: 10,
    //       repeat: 0
    //       });


    console.log("camera BEFORE going to follow player");
    this.cameras.main.setBounds(0,0, this.map.world_width_px, this.map.world_height_px);
    this.cameras.main.startFollow(this.my_player.sprite);
    console.log("camera going to follow player");
    //this.cursors = this.input.keyboard.createCursorKeys();
    // this.input.keyboard.on()

    //this technically works, but would have to guess the strings
    // this.input.keyboard.on('keydown_A', function (event:any) {
    //   console.log('Hello from the A Key!');
    // });
          // interface io;

    //  let socket = io("http://localhost:8081/");
    
    // socket = io();
    // let socket:any = SocketIO();
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
    
      
  

    if (down.isDown) 
    {
      this.my_player.y+=speed;
      this.my_player.anims.play('down', true);
    }
    else if (up.isDown) 
    {
      this.my_player.y-=speed;
      this.my_player.anims.play('up', true);
    }

    if (left.isDown) 
    {
      this.my_player.x-=speed;
      this.my_player.anims.play('left', true);
    }
    else if (right.isDown) 
    {
      this.my_player.x+=speed;
      this.my_player.anims.play('right', true);
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


    // if (this.cursors.down.isDown)
    // {    
    //     this.my_player.y-=speed;
    // }
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


