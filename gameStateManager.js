var Technotip = {};

Technotip.Main = function (game) {
};
Technotip.Level_1 = function (game) {
};
Technotip.Main.prototype = {

    up: function () {
        console.log('button up', arguments);
    },
    over: function () {
        console.log('button over');
    },
    out: function () {
        console.log('button out');
    },

    actionOnClick: function (e) {
        console.log(e.name);
        fx.play('button_click');
        if (e.name == "play") {
            this.state.start("Level_1");
            music.pause();

        }

        if (e.name == "options") {
            main_menu_button_group.visible = false;
            options_menu_button_group.visible = true;
            how_menu_group.visible = false;
            backButton.visible = true;
        }
        if (e.name == "back") {
            main_menu_button_group.visible = true;
            options_menu_button_group.visible = false;
            how_menu_group.visible = false;
            backButton.visible = false;
        }
        if (e.name == "how") {
            main_menu_button_group.visible = false;
            options_menu_button_group.visible = false;
            how_menu_group.visible = true;
            backButton.visible = true;
        }
        if (e.name == "mute") {
            if (mute == 0) {
                mute = 1;
                music.pause();
                e.label.setText("Unmute");
            }
            else {
                mute = 0;
                music.resume();
                e.label.setText("Mute");
            }

        }
    },

    preload: function () {


        game.load.image('menu_background', 'assets/mario/images/menu_background.jpg');
        game.load.audio('menu_theme', ['assets/mario/audio/menu_theme.mp3']);
        game.load.spritesheet('button', 'assets/mario/images/default_button_sprite_sheet.png', 193, 71);
        game.load.audio('button_click', 'assets/mario/audio/button_click.mp3');

    },
    create: function () {

        // Tło
        background = game.add.tileSprite(0, 0, 800, 600, 'menu_background');
        // Muzyka   
        music = game.add.audio('menu_theme');
        if(mute==0)
        {
            music.play();
        }
        // Przyciski będą w grupie
        main_menu_button_group = game.add.group();
        options_menu_button_group = game.add.group();
        how_menu_group = game.add.group();

        //Tworzenie właściwych przycisków i podmenu
        //MAIN MENU
        playButton = new LabelButton(this.game, 400, 100, "button", "Play", 'play', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(playButton);

        optionsButton = new LabelButton(this.game, 400, 200, "button", "Options", 'options', this.actionOnClick, this, 1, 0,2);
        main_menu_button_group.add(optionsButton);

        howButton = new LabelButton(this.game, 400, 300, "button", "How to play", 'how', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(howButton);

        quitButton = new LabelButton(this.game, 400, 400, "button", "Quit", 'quit', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(quitButton);

        //OPTIONS
        muteButton = new LabelButton(this.game, 400, 200, "button", "Mute", 'mute', this.actionOnClick, this, 1, 0, 2);
        options_menu_button_group.add(muteButton);

        //HOW
        var howText = "Zbierz wszystkie gwiazdki\n i zdezintegruj wrogów \n";
        var howText_style = { font: "30px Arial", fill: "white", align: "center" };
        var howText_object = game.add.text(game.world.centerX - 300, 200, howText, howText_style);
        how_menu_group.add(howText_object);


        // BackButton będzie w osobnej grupie
        backButton = new LabelButton(this.game, 400, 300, "button", "Back", 'back', this.actionOnClick, this, 1, 0, 2);

        //playButton.onInputOver.add(over, this);
        //playButton.onInputOut.add(out, this);
        //playButton.onInputUp.add(up, this);



        //Widoczność grup
        main_menu_button_group.visible = true;
        options_menu_button_group.visible = false;
        how_menu_group.visible = false;
        backButton.visible = false;


        //AUDIO
        fx = game.add.audio('button_click');
        fx.allowMultiple = true;
        fx.addMarker('button_click', 0, 1.0);




    },

    update: function () {

    },
}
Technotip.Level_1.prototype = {

    up: function () {
        console.log('button up', arguments);
    },
    over: function () {
        console.log('button over');
    },
    out: function () {
        console.log('button out');
    },

    actionOnClick: function (e) {
        fx.play('button_click');
        if (e.name == "quitToMain") {
            this.state.start("Main");
            music.stop();

        }
    },
    preload: function () {


        game.load.image('menu_background', 'assets/mario/images/menu_background.jpg');
        game.load.spritesheet('button', 'assets/mario/images/default_button_sprite_sheet.png', 193, 71);
        game.load.audio('button_click', 'assets/mario/audio/button_click.mp3');
    },
    create: function () {
        // Tło
        background = game.add.tileSprite(0, 0, 800, 600, 'menu_background');
        //HUD
        quitToMainButton = new LabelButton(this.game, 400, 100, "button", "QUIT", 'quitToMain', this.actionOnClick, this, 1, 0, 2);
        if(mute==0)
        {
            music.stop();
            music.play();
        }
    },
    update: function () {
    }
};