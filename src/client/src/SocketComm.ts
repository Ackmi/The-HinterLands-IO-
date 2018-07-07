
import { Message } from './../../shared/Messages/Message';
import { Game, MyScene } from './game';
import { Scene } from 'phaser';
import {PlayerMessages} from "../../shared/Messages/PlayerMessages";
import Player from '../../shared/Entities/Player';


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
        console.log("connected!!");
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
        console.log("SetupPlayerMessages: ");

        this.socket.on(PlayerMessages.SelfFromServer.GetMessageType(), (data:any)=>this.SelfFromServer(new PlayerMessages.SelfFromServer().SetJSONObj(data))); 
        this.socket.on(PlayerMessages.AddNewPlayer.GetMessageType(), (data:any)=>this.AddNewPlayer(new PlayerMessages.AddNewPlayer().SetJSONObj(data)));       
        this.socket.on(PlayerMessages.AddOtherPlayers.GetMessageType(), (data:any)=>{console.log("data recived: "+JSON.stringify(data)); this.AddOtherPlayers(new PlayerMessages.AddOtherPlayers().SetJSONObj(data))}); 
        this.socket.on(PlayerMessages.Position.GetMessageType(), (data:any)=>this.UpdateOtherPlayerPosition(new PlayerMessages.Position().SetJSONObj(data))); 
        // this.socket.on('disconnect', this.Disconnected);    
    }

    //player related messages
    SelfFromServer(data:PlayerMessages.SelfFromServer)
    {
        console.log("SelfFromServer recieved: "+JSON.stringify(data));
        this.scene.my_player.x=data.x;
        this.scene.my_player.y=data.y;
        this.scene.my_player.id=data.id;
    }
    AddNewPlayer(data:PlayerMessages.AddNewPlayer)
    {
        console.log("AddNewPlayer: "+data);

        console.log("Adding new player: "+data);
        let player_new:Player = new Player();
        player_new.Preload(this.scene);
        player_new.CreatePlayer(this.scene, this.scene.map.tile_size);
        player_new.x=data.x;
        player_new.y=data.y;
        player_new.id=data.id;
        this.scene.players.push(player_new);
    }
    AddOtherPlayers(data:PlayerMessages.AddOtherPlayers)
    {
        console.log("AddOtherPlayers: "+JSON.stringify(data.players));
        //lets add them to the game
        
        for(let i:number=0;i<data.players.length;i++)
        {
            console.log("Adding new player: "+data.players[i]);
            let player_new:Player = new Player();
            player_new.Preload(this.scene);
            player_new.CreatePlayer(this.scene, this.scene.map.tile_size);
            player_new.x=data.players[i].x;
            player_new.y=data.players[i].y;
            player_new.id=data.players[i].id;
            this.scene.players.push(player_new);
        }
        // data.players.forEach((value: PlayerMessages.Player, key: string) => {
        //     console.log(key, value);
        // });
        //so now we need to create a new player
    }
    UpdateOtherPlayerPosition(data:PlayerMessages.Position)
    {
        console.log("UpdateOtherPlayerPosition: "+data);
        //find the other player, and update their position
        for(let i:number=0;i<this.scene.players.length;i++)
            if(this.scene.players[i].id===data.id)
            {
                this.scene.players[i].x=data.x;
                this.scene.players[i].y=data.y;
            }
    }
    Emit(message_type:string, obj:Object)
    {
        this.socket.emit(message_type, obj);
    }

    

}