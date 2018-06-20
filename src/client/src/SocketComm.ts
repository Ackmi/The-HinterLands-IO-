import { Game, MyScene } from './game';
import { Scene } from 'phaser';


// import io from 'socket.io-client';

declare var io: any;

export default class SocketComm
{
    socket:any;
    game:Game;
    scene!:MyScene;
    constructor(game:Game)
    {
        this.game=game;
    }
    public Connect(scene:MyScene)
    {
        console.log("SocketComm: connect, scene: "+scene);
        this.scene=scene;
        this.socket = io('http://localhost:8081');

        // socket.on('connect', function(){console.log("connected!!");});
        // socket.on('event', function(data:any){});
        // socket.on('disconnect', function(){});        
        this.socket.on('connect', this.Connected);
        this.socket.on('event', this.Received);
        this.socket.on('message', (data:any, data2:any)=>{console.log("recieved message with data: "+data+", data2: "+data2);});
        this.socket.on('disconnect', this.Disconnected);    

        this.SetupPlayerMessages();
    }
    Connected()
    {
        console.log("connected!!1");
    }
    Received(data:any)
    {
        console.log("Received data: ");
        console.log("Received data: "+data);
    }
    Disconnected()
    {
        console.log("disconnected!!");
    }



    SetupPlayerMessages()
    {
        this.socket.on('AddSelf', (data:any)=>this.AddSelf(data)); 
        this.socket.on('AddNewPlayer', this.AddNewPlayer);            
        this.socket.on('AddOtherPlayers', this.AddOtherPlayers); 
        // this.socket.on('disconnect', this.Disconnected);    
    }

    //player related messages
    AddSelf(data:any)
    {
        console.log("AddSelf: "+JSON.stringify(data));
        this.scene.my_player.x=data.x;
        this.scene.my_player.y=data.y;
    }
    AddNewPlayer(data:any)
    {
        console.log("AddNewPlayer: "+data);
    }
    AddOtherPlayers(data:any)
    {
        console.log("AddOtherPlayers: "+data);
    }

    

}