class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, left, right, down) {
        super(scene, x, y, texture, frame);
  
        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = -2;
        this.sfxPlayer = scene.sound.add('sfx_rocket'); // add rocket sfx
        this.left = left;
        this.right = right;
        this.down = down;

        //this.width *= 0.06;
        //this.height *= 0.06;
        console.log(this.width);
        // if(this.texture.key == "hook2"){
        //     this.flipX = true;
        // }
    }

    update(){
        console.log(this.height, this.y);
        //left movement
        if(!this.isFiring){
            if(this.left.isDown && this.x>= this.width){
                this.x += this.moveSpeed;
            }
            //right movement
            else if (this.right.isDown && this.x <= game.config.width - this.width){
                this.x -= this.moveSpeed;
            }
        }
        //fire button
        if(Phaser.Input.Keyboard.JustDown(this.down) && !this.isFiring){
            this.isFiring = true;
            this.sfxPlayer.play();
        }
        //move up when fired
        if(this.isFiring && this.y <= game.config.height + this.height){
            this.y -= this.moveSpeed;
        }
        //reset on miss
         if(this.y >= borderPadding *2){
             this.isFiring = false;
             this.reset();
             //this.y = game.config.height - borderUISize - borderPadding;
         }
    }

    // reset player to "ground"
    reset(){
        this.isFiring = false;
        this.y = borderUISize - game.config.height;
    }
}