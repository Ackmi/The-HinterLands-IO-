import { MathHelpers } from './../Tools/MathHelpers';
import {Message} from "./Message";
import {Utils} from "../Tools/Utils";


export namespace PlayerMessages
{
    export class Player extends Message
    {
        //functions needed to get javascript to work with static variables
        GetMessageType(): string {return Player.GetMessageType();}
        static GetMessageType():string{return "Player";}

        x:number;
        y:number; 
        id:string="not set";

        /*
        from:
        https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript/40976608#40976608
        for doing constructor overloads in typescript
        */

        constructor(x:number, y:number, id:string)       
        {
            super();
            this.x=MathHelpers.Round(x);
            this.y=MathHelpers.Round(y);
            console.log("position: "+this.x, this.y);
            this.id=id;
            return this;
        }
        
    }
    export class Position extends Message
    {
        //functions needed to get javascript to work with static variables
        GetMessageType(): string {return Position.GetMessageType();}
        static GetMessageType():string{return "Position";}

        x:number=0;
        y:number=0;
        id:string="not set";
        constructor(x?:number, y?:number, id?:string)
        {
            super();
            if(x!=undefined&&y!=undefined&&id!=undefined)
            {
                this.x=MathHelpers.Round(x);
                this.y=MathHelpers.Round(y);
                this.id=id;
            }
            return this;
        }
        
    }
    /* For the server to let a player know to add themself, where/how*/
    export class SelfFromServer extends Message
    {
        //functions needed to get javascript to work with static variables
        GetMessageType(): string {return SelfFromServer.GetMessageType();}
        static GetMessageType():string{return "SelfFromServer";}

        x:number=0;
        y:number=0;        
        id:string="not set";
        constructor(player?:PlayerMessages.Player)
        {
            super();
            if(player!=undefined)
            {
                this.x=MathHelpers.Round(player.x);
                this.y=MathHelpers.Round(player.y);
                this.id=player.id;
            }
        }
    }
    /* When a new player connects, send to existing players*/
    export class AddNewPlayer extends Message
    {
        //functions needed to get javascript to work with static variables
        GetMessageType(): string {return AddNewPlayer.GetMessageType();}
        static GetMessageType():string{return "AddNewPlayer";}

        x:number=0;
        y:number=0;
        id:string="";
        constructor(player?:PlayerMessages.Player)
        {
            super();
            if(player!=undefined)
            {
                this.x=MathHelpers.Round(player.x);
                this.y=MathHelpers.Round(player.y);
                this.id=player.id;
            }
        }
    }
    /* For a new player to get a copy of other existing players*/
    export class AddOtherPlayers extends Message
    {
        //functions needed to get javascript to work with static variables
        GetMessageType(): string {return AddOtherPlayers.GetMessageType();}
        static GetMessageType():string{return "AddOtherPlayers";}

        //NOTE: Maps can't be transmitted over socket IO
        players!:PlayerMessages.Player[];
        constructor(players?:PlayerMessages.Player[])
        {
            super();
            if(players!=null)
            {
                this.players=players;
                console.log("server, about to send out players: "+players);
                // Utils.GetJSONFromPlayerMap(players);
            }
            return this;
        }
    }
}
