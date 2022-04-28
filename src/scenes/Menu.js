class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    
    preload(){
        //load audio
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_explosion', './assets/pop.wav');
        this.load.audio('sfx_hook', './assets/throwreel.wav');
        this.load.audio('music', './assets/tiger.mp3');


        this.load.image('water', './assets/water.png');
        this.load.image('sand', './assets/sand.png');
    }

    create(){
        this.water = this.add.tileSprite(0, 0, 640, 480, 'water').setOrigin(0, 0);
        this.sand = this.add.tileSprite(0, 430, 640, 50, 'sand').setOrigin(0, 0);

        let menuConfig = {
            fontFamily: 'Mermaid Astramadea',
            fontSize: '40px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize*3 - borderPadding, 'Fishing Trip', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = "25px";
        this.add.text(game.config.width/2,game.config.height/2 - borderPadding, 'P1: (A)(D) arrows to move & (S) to fire\nP2: (<-)(->) arrows to move & (↓) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2,game.config.height/2 + borderUISize + borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(){
        this.water.tilePositionX -= 0.5;
        this.sand.tilePositionX -= 1;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
              spaceshipSpeed: 1,
              gameTimer: 60000    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
              spaceshipSpeed: 2.5,
              gameTimer: 30000    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
    }
}