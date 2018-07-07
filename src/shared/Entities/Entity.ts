
import {Scene} from "phaser";
import * as Phaser from "phaser";

/**
 * Entity is anything with an position(x,y), such as a player, enemy, animal, NPC
 */

export class Entity
{
    sprite!:Phaser.GameObjects.Sprite;
    id:string="not set";

    
    Entity()
    {

    }
    get x():number
    {
        return this.sprite.x;
    }
    set x(x:number)
    {
        this.sprite.x=x;
    }
    get y():number
    {
        return this.sprite.y;
    }
    set y(y:number)
    {
        this.sprite.y=y;
    }
    get anims():Phaser.GameObjects.Components.Animation
    {
        return this.sprite.anims;
    }
    get width():number
    {
        return this.sprite.width;
    }
    get height():number
    {
        return this.sprite.height;
    }

    SetXY(x:number, y:number)
    {
        this.x=x;
        this.y=y;
    }

    /**
     * Phaser related functions
     */
    Preload(scene:Scene)
    {
    }
    Create(scene:Scene)
    {

    }
}