class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }


    preload() {
        // load images/tile sprites

        this.load.image('hook1', './assets/hook1.png');
        this.load.image('hook2', './assets/hook2.png');
        this.load.image('fish1', './assets/fish1.png');
        this.load.image('fish2', './assets/fish2.png');
        this.load.image('water', './assets/water.png');
        this.load.image('sand', './assets/sand.png');

        // load sprite
        this.load.spritesheet('bubbles', './assets/bubbles.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});

      }
    

    create(){
        // place tile sprite
        this.water = this.add.tileSprite(0, 0, 640, 480, 'water').setOrigin(0, 0);
        this.sand = this.add.tileSprite(0, 430, 640, 50, 'sand').setOrigin(0, 0);


        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);        
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // add players (p1 and p2)
        this.p1Player = new Player(this, game.config.width/2 - borderUISize, borderUISize - game.config.height, 'hook1',0, keyA, keyD, keyS).setOrigin(0.5, 0);
        this.p2Player = new Player(this, game.config.width/2 + borderUISize, borderUISize - game.config.height, 'hook2',0, keyLEFT, keyRIGHT, keyDOWN).setOrigin(0.5, 0);

        // Spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*6, 'fish1', 0, 10, game.settings.spaceshipSpeed, false).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, 0 - borderUISize * 3, borderUISize*8 + borderPadding*2, 'fish1', 0, 20, game.settings.spaceshipSpeed +0.5, true).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*10 + borderPadding*4, 'fish1', 0, 30, game.settings.spaceshipSpeed+1, false).setOrigin(0,0);
        this.ship04 = new Spaceship(this, 0 - borderUISize * 3, borderUISize*11 + borderPadding*6, 'fish2', 0, 100, game.settings.spaceshipSpeed +2, true).setOrigin(0,0);




        // animation config
        this.anims.create({
            key: 'bubble',
            frames: this.anims.generateFrameNumbers('bubbles', { start: 0, end: 3, first: 0}),
            frameRate: 20
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Mermaid Astramadea',
            fontSize: '33px',
            //backgroundColor: '#f6d265',
            stroke: '#000000',
            strokeThickness: '4',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let endConfig = {
            fontFamily: 'Mermaid Astramadea',
            fontSize: '28px',
            backgroundColor: '#f6d265',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }


        //Display Scores        
        scoreConfig.stroke= '#452634';
        this.scoreLeft = this.add.text(borderUISize, game.config.height - borderUISize*1.3, 0, scoreConfig);

        scoreConfig.stroke= '#014421';
        this.scoreRight = this.add.text(game.config.width - borderUISize*2.4, game.config.height - borderUISize*1.3, 0, scoreConfig);

        //Display Timer
        scoreConfig.stroke= '#f6d265';
        this.timerCenter = this.add.text(game.config.width /2, game.config.height - borderUISize*1.3, 0, scoreConfig);
        
        //GAME OVER flag
        this.gameOver = false;

        //60 second clock
        this.clock  = this.time.delayedCall(game.settings.gameTimer, () =>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', endConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(R) for Restart\n(<-) for Menu', endConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //Initialize a timer
        this.countdown = Math.ceil(this.clock.getRemainingSeconds());
        
    }

    update() {
        //Update time remaining  
        this.countdown = Math.ceil(this.clock.getRemainingSeconds());
        this.timerCenter.text = this.countdown;

        //Check key for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start('menuScene');
        }

        // Update if not gameover
        this.water.tilePositionX -= 0.5;
        this.sand.tilePositionX -= 1;


        if(!this.gameOver){
            this.p1Player.update();
            this.p2Player.update();
            // update spaceships (x3)
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();  
            this.ship04.update();   
            // check collisions
            if(this.checkCollision(this.p1Player, this.ship04)) {
                this.p1Player.reset();
                this.shipExplode(this.p1Player,this.ship04);
            }
            if(this.checkCollision(this.p1Player, this.ship03)) {
                this.p1Player.reset();
                this.shipExplode(this.p1Player,this.ship03);
            }
            if (this.checkCollision(this.p1Player, this.ship02)) {
                this.p1Player.reset();
                this.shipExplode(this.p1Player,this.ship02);
            }
            if (this.checkCollision(this.p1Player, this.ship01)) {
                this.p1Player.reset();
                this.shipExplode(this.p1Player,this.ship01);
            }

            if(this.checkCollision(this.p2Player, this.ship04)) {
                this.p2Player.reset();
                this.shipExplode(this.p2Player,this.ship04);
            }
            if(this.checkCollision(this.p2Player, this.ship03)) {
                this.p2Player.reset();
                this.shipExplode(this.p2Player,this.ship03);
            }
            if (this.checkCollision(this.p2Player, this.ship02)) {
                this.p2Player.reset();
                this.shipExplode(this.p2Player,this.ship02);
            }
            if (this.checkCollision(this.p2Player, this.ship01)) {
                this.p2Player.reset();
                this.shipExplode(this.p2Player,this.ship01);
            }
        } 
    }

    checkCollision(player, ship) {
        // simple AABB checking
        if (player.x < ship.x + ship.width && 
            player.x + player.width > ship.x && 
            player.y + 480 < ship.y + ship.height &&
            player.height + player.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(player,ship) {
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'bubbles').setOrigin(0, 0);
        ship.reset();
        boom.anims.play('bubble');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          boom.destroy();                       // remove explosion sprite
        });

        if(player.texture.key == "hook1"){
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }
        else{
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
             
        this.sound.play('music');  
    }
}