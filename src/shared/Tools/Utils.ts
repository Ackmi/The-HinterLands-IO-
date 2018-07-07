import { PlayerMessages } from './../Messages/PlayerMessages';

export class Utils
{
    static GetJSONFromPlayerMap(map:Map<string, PlayerMessages.Player>)
    {
        // let array
        map.forEach((value: PlayerMessages.Player, key: string) => {
            console.log("GetJSONFromPlayerMap:",key, value);
        });
    }
}