import {Entity} from "./Entity";
import {Scene} from "phaser";
import * as Phaser from "phaser";

export default class Player extends Entity
{
    Player()
    {

    }

    /**
     * Phaser related functions
     */
    Preload(scene:Scene)
    {
        scene.load.spritesheet('guy_anim', 'assets/images/character.png',  { frameWidth: 16, frameHeight: 32});
        scene.load.spritesheet('guy_attack', 'assets/images/guy_attack_32x32.png',  { frameWidth: 32, frameHeight: 32});
    }
    CreatePlayer(scene:Scene, tile_size:number)
    {
        this.sprite= scene.add.sprite(250, 200, 'guy_anim');//.setOrigin(0,0);
        this.sprite.setDisplaySize(tile_size, tile_size*2);
        this.SetupAnimations(scene);        
    }
    SetupAnimations(scene:Scene)
    {
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('guy_anim', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
            });
          scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('guy_anim', { start: 5, end: 7 }),
            frameRate: 1,
            repeat: -1
            });
            scene.anims.create({
              key: 'right',
              frames: scene.anims.generateFrameNumbers('guy_anim', { start: 17, end: 20 }),
              frameRate: 10,
              repeat: -1
              });
            scene.anims.create({
              key: 'up',
              frames: scene.anims.generateFrameNumbers('guy_anim', { start: 34, end: 37 }),
              frameRate: 10,
              repeat: -1
              });
            scene.anims.create({
              key: 'left',
              frames: scene.anims.generateFrameNumbers('guy_anim', { start: 51, end: 54 }),
              frameRate: 10,
              repeat: -1
              });
              scene.anims.create({
                key: 'attack_down',
                frames: scene.anims.generateFrameNumbers('guy_attack', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: 0
                });
    }

}