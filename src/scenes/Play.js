class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }


    preload() {
        // load images/tile sprites
        this.load.image('player1', './assets/player1.png');
        this.load.image('player2', './assets/player2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load sprite
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }
    

    create(){
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        //this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);        
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // add players (p1 and p2)
        this.p1Player = new Player(this, game.config.width/2 - borderUISize, borderUISize, 'player1',0, keyA, keyD, keyS).setOrigin(0.5, 0);
        this.p2Player = new Player(this, game.config.width/2 + borderUISize, borderUISize, 'player2',0, keyLEFT, keyRIGHT, keyDOWN).setOrigin(0.5, 0);

        // Spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*6, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*8 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*10 + borderPadding*4, 'spaceship', 0, 30).setOrigin(0,0);


        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 0, scoreConfig);
        this.scoreRight = this.add.text(game.config.width - borderUISize*4.5, borderUISize + borderPadding*2, 0, scoreConfig);

        
        //GAME OVER flag
        this.gameOver = false;

        //60 second clock
        scoreConfig.fixedWidth = 0;
        this.clock  = this.time.delayedCall(game.settings.gameTimer, () =>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //Initialize a timer
        this.countdown = Math.ceil(this.clock.getRemainingSeconds());
        
        //Display Timer
        this.timerCenter = this.add.text(game.config.width /2, game.config.height - borderUISize, this.countdown, scoreConfig);
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
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver){
            this.p1Player.update();
            this.p2Player.update();
            // update spaceships (x3)
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();     
            // check collisions
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
            player.y < ship.y + ship.height &&
            player.height + player.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(player,ship) {
        // temporarily hide ship
        //ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        ship.reset();
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          //ship.reset();                         // reset ship position
          //ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });

        if(player.texture.key == "player1"){
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }
        else{
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
             
        this.sound.play('sfx_explosion');  
    }
}