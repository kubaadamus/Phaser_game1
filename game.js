var game = new Phaser.Game(800, 600, Phaser.CANVAS);
game.state.add('Main',GameManager.Main);
game.state.add('Level_1',GameManager.Level_1);
game.state.start('Level_1');

