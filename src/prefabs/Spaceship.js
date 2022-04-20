class Spaceship extends Phaser.GameObjects.Sprite{
    constructor(scene, x,y,texture, frame, pointValue, speed, flip){
        super(scene,x,y,texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = speed;
        this.flip = flip;

        this.flipX = flip;
        if(this.texture.key == "fish2"){

            this.scale /= 2;
            this.height /= 2;
            this.width /=2;
        }

    }

    update(){
        // move left if flip is false, right if flip is true
        if(this.flip == false){
            this.x -= this.moveSpeed;
            // wrap around from left edge to the right edge
            if(this.x <= 0 - this.width){
                this.reset();
            }    
        }
        else{
            this.x += this.moveSpeed;
            // wrap around from left edge to the right edge
            if(this.x >= game.config.width + this.width){
                this.reset();
            }     
        }
        
    }

    reset(){
        if(this.flip == false){
            this.x = game.config.width + borderUISize;
        }
        else{
            this.x = 0 - borderUISize*3;
        }
        
    }
}