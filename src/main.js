let config = {
    type: Phaser.CANVAS,
    width: 640,
    height:480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyA, keyS, keyD, keyLEFT, keyRIGHT, keyDOWN;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Point breakdown in README