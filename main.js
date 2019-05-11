GameManager.Main.prototype = {

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
        if (mute == 0) {
            music.play();
        }
        // Przyciski będą w grupie, żeby wlączać lub wyłączać widoczność dla wszystkich na raz
        main_menu_button_group = game.add.group();
        options_menu_button_group = game.add.group();
        how_menu_group = game.add.group();

        //Tworzenie właściwych przycisków i podmenu
        //MAIN MENU
        playButton = new LabelButton(this.game, 400, 100, "button", "Play", 'play', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(playButton);

        optionsButton = new LabelButton(this.game, 400, 200, "button", "Options", 'options', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(optionsButton);

        howButton = new LabelButton(this.game, 400, 300, "button", "How to play", 'how', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(howButton);

        quitButton = new LabelButton(this.game, 400, 400, "button", "Quit", 'quit', this.actionOnClick, this, 1, 0, 2);
        main_menu_button_group.add(quitButton);

        //OPTIONS
        muteButton = new LabelButton(this.game, 400, 200, "button", "Mute", 'mute', this.actionOnClick, this, 1, 0, 2);
        options_menu_button_group.add(muteButton);

        mute_fxButton = new LabelButton(this.game, 400, 300, "button", "Mute fx", 'mute_fx', this.actionOnClick, this, 1, 0, 2);
        options_menu_button_group.add(mute_fxButton);



        // BackButton będzie w osobnej grupie bo jest uniwersalny dla kilku podmenu
        backButton = new LabelButton(this.game, 400, 400, "button", "Back", 'back', this.actionOnClick, this, 1, 0, 2);

        //To opcjonalne eventy dla przycisku, odpalają odpowiednie callbacki i podają wciśnięty przycisk (this)
        //playButton.onInputOver.add(over, this);
        //playButton.onInputOut.add(out, this);
        //playButton.onInputUp.add(up, this);

        //Widoczność grup. Na początku gry niektóre ukrywam a inne pokazuję
        main_menu_button_group.visible = true;
        options_menu_button_group.visible = false;
        how_menu_group.visible = false;
        backButton.visible = false;

        //AUDIO przycisków
        fx = game.add.audio('button_click');
        fx.allowMultiple = true;
        fx.addMarker('button_click', 0, 1.0);

        //shapey
        //rectA = new Phaser.Rectangle(200, 100, 400, 100);
        //HOW
        var howText = "Zbierz wszystkie gwiazdki\n i zdezintegruj wrogów";
        var howText_style = { font: "30px Arial", fill: "white", align: "center" };
        var howText_object = game.add.text(0, 0, howText, howText_style);
        
        howText_object.position.x -=howText_object.width/2;
        howText_object.position.y -=howText_object.height/2;
    
        graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x910c00);
        graphics.drawRect(-200,-50,400,100);
        graphics.endFill();
        
        how_menu_group.add(graphics);
        how_menu_group.add(howText_object);
        //how_menu_group.pivot.x = 200;
        //how_menu_group.pivot.y = 50;
        how_menu_group.position.x = game.world.centerX;
        how_menu_group.position.y = game.world.centerY;
        console.log(how_menu_group.position);

       // console.log(how_menu_group.width/2+game.world.centerX);
        //console.log(how_menu_group.height/2+game.world.centerY);
    },
    actionOnClick: function (e) {
        //Po kliknięciu na jakiś button odpal dźwięk klikniecia

        if (mute_fx == 0) {
            fx.play('button_click');
        }

        //Handluj z przyciskami
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
        if (e.name == "quit") {
            history.go(-1);
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
        if (e.name == "mute_fx") {
            if (mute_fx == 0) {
                mute_fx = 1;
                e.label.setText("Unmute FX");
            }
            else {
                mute_fx = 0;
                e.label.setText("Mute FX");
            }
        }
    },
    update: function () {
        how_menu_group.angle += 1;

    },
}