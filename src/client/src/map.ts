import * as Phaser from "phaser";


export class Map
{    
    scene:Phaser.Scene;
    tiles:number[][]=[[]];
    num_tiles_x:number=35;
    num_tiles_y:number=35;
    //TODO: doesnt work for creating an array if not square

    grass_num:number=0;
    grass:string="grass";

    tile_size:number=25;

    world_width_px:number=this.tile_size*this.num_tiles_x;
    world_height_px:number=this.tile_size*this.num_tiles_y;

    constructor(scene:Phaser.Scene)
    {
        this.scene=scene;
        this.CreateMap();
    }

    //helper function for letting JS create 2d arrays: from: https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
    Create2DArray(height:number) 
    {
        var arr = [];
      
        for (var i=0;i<height;i++) 
        {
           arr[i] = [];
        }
      
        return arr;
      }

    CreateMap()
    {
        this.tiles= this.Create2DArray(this.num_tiles_y);

        for(let x:number= 0;x<this.num_tiles_x;x++)
            for(let y:number= 0;y<this.num_tiles_y;y++)
            {
                // console.log("adding tile: "+x+", "+y);
                this.tiles[x][y]=0;
            }

    }
    preload()
    {
        this.scene.load.image("grass", "assets/images/grass_tile.jpg");
        // this.scene.load.image("grass", "assets/images/grass_tile1.jpg");//if it can't find the image- it just fails silently -_-
        console.log("Map: done preload");
    }
    create()
    {
        console.log("Map: puting grass on screen!");
        // var s = this.scene.add.sprite(100, 100, 'grass').setOrigin(0,0).setSize(200,200);//.setScale(2,2);        
        // s.setDisplaySize(300,200);

        //lets add all the grass tiles
        for(let x:number= 0;x<this.num_tiles_x;x++)
            for(let y:number= 0;y<this.num_tiles_y;y++)
            {
                if(this.tiles[x][y]==this.grass_num)
                {
                    var s = this.scene.add.sprite(x*this.tile_size, y*this.tile_size, this.grass).setOrigin(0,0);        
                    s.setDisplaySize(this.tile_size,this.tile_size);
                }
            }
            // Phaser.Tilemaps.Formats.ARRAY_2D
        
    }

}