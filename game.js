var game = new Phaser.Game(800, 600, Phaser.CANVAS);
game.state.add('Main',Technotip.Main);
game.state.add('Level_1',Technotip.Level_1);
game.state.start('Main');