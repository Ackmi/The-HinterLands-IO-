/*
Basic message class:
    will have:
    1. text representing the kind of object it is
    2. json object
*/
export class Message
{
    /*
    returns the name of the class
    HAS TO BE OVERRIDDEN
    */
    //functions needed to get javascript to work with static variables
    GetMessageType(): string {return Message.GetMessageType();}
    static GetMessageType():string{return "Message";}

   static Hello()
   {

   }
   

    constructor()
    {
        
    }

    
    GetJSONObj():string
    {
        return JSON.stringify(this);
    }
    /*
    pass in a generic object, and copy all the fields to this object
    (required for getting the object from JSON/ socket.io- will return an object with the same structure, but not the same class)
    */
    SetJSONObj(obj:Object)
    {
        // console.log("Set JSON obj!:"+obj);
        for(var property in obj) 
        {
            (<any>this)[property]=(<any>obj)[property];
            // console.log("this prop: "+(<any>obj)[property];
        }
            return this;
    }
}