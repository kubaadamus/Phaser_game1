var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    //==================================================== MENU ===========================================//
    game.load.image('menu_background', 'assets/mario/images/menu_background.jpg');
    game.load.audio('menu_theme', ['assets/mario/audio/menu_theme.mp3']);
    game.load.spritesheet('button', 'assets/mario/images/default_button_sprite_sheet.png', 193, 71);
}

function create() {
    //==================================================== MENU ===========================================//
    // Tło
    background = game.add.tileSprite(0, 0, 800, 600, 'menu_background');
    // Muzyka   
    music = game.add.audio('menu_theme');
    //music.play();
    // Przyciski będą w grupie
    main_menu_button_group = game.add.group();
    options_menu_button_group = game.add.group();

    //Widoczność grup
    main_menu_button_group.visible = true;
    options_menu_button_group.visible = false;

    //Tworzenie właściwych przycisków
    //MAIN MENU
    playButton = game.add.button(game.world.centerX - 200, 100, 'button', actionOnClick, this, 2, 1, 0);
    playButton.name = 'play';
    main_menu_button_group.add(playButton);

    optionsButton = game.add.button(game.world.centerX - 200, 200, 'button', actionOnClick, this, 2, 1, 0);
    optionsButton.name = 'options';
    main_menu_button_group.add(optionsButton);

    howButton = game.add.button(game.world.centerX - 200, 300, 'button', actionOnClick, this, 2, 1, 0);
    howButton.name = 'how';
    main_menu_button_group.add(howButton);

    creditsButton = game.add.button(game.world.centerX - 200, 400, 'button', actionOnClick, this, 2, 1, 0);
    creditsButton.name = 'credits';
    main_menu_button_group.add(creditsButton);

    quitButton = game.add.button(game.world.centerX - 200, 500, 'button', actionOnClick, this, 2, 1, 0);
    quitButton.name = 'quit';
    main_menu_button_group.add(quitButton);
    //OPTIONS
    muteButton = game.add.button(game.world.centerX - 200, 100, 'button', actionOnClick, this, 2, 1, 0);
    muteButton.name = 'mute';
    options_menu_button_group.add(muteButton);

    muteButton = game.add.button(game.world.centerX - 200, 200, 'button', actionOnClick, this, 2, 1, 0);
    muteButton.name = 'easy';
    options_menu_button_group.add(muteButton);

    muteButton = game.add.button(game.world.centerX - 200, 300, 'button', actionOnClick, this, 2, 1, 0);
    muteButton.name = 'hard';
    options_menu_button_group.add(muteButton);

    backButton = game.add.button(game.world.centerX - 200, 400, 'button', actionOnClick, this, 2, 1, 0);
    backButton.name = 'back';
    options_menu_button_group.add(backButton);


    //playButton.onInputOver.add(over, this);
    //playButton.onInputOut.add(out, this);
    //playButton.onInputUp.add(up, this);



    // adding a custom label button

    btnStart = new LabelButton(this.game, 480, 512, "button", "Start game!", actionOnClick, this, 1, 0, 2); // button frames 1=over, 0=off, 2=down





}
function update() {
}

var LabelButton = function (game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.style = { 'font': '30px Arial', 'fill': 'white' };
    this.anchor.setTo(0.5, 0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    this.label.anchor.setTo(0.5, 0.5);
    this.addChild(this.label);
    this.setLabel(label);
    game.add.existing(this);
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton; LabelButton.prototype.setLabel = function (label) {
    this.label.setText(label);
};

//=================== FUNKCJE PRZYCISKÓW ===============================//
function up() {
    console.log('button up', arguments);
}
function over() {
    console.log('button over');
}
function out() {
    console.log('button out');
}
function actionOnClick(e) {
    console.log(e.name);

    if (e.name == "options") {
        main_menu_button_group.visible = false;
        options_menu_button_group.visible = true;
    }
    if (e.name == "back") {
        main_menu_button_group.visible = true;
        options_menu_button_group.visible = false;
    }
}