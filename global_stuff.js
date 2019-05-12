//Game options
var mute = 0;
var mute_fx = 0;
var lives = 0;

var LabelButton = function (game, x, y, key, label, name, callback, callbackContext, overFrame, outFrame, downFrame,

    upFrame) {
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.style = { 'font': '30px Arial', 'fill': 'white' };
    this.anchor.setTo(0.5, 0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    this.label.anchor.setTo(0.5, 0.5);
    this.name = name;
    this.addChild(this.label);
    this.setLabel(label);
    game.add.existing(this);
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton; LabelButton.prototype.setLabel = function (label) {
    this.label.setText(label);
};

function trol() {
    console.log("TROL");
}

function up() {
    console.log('button up', arguments);
}
function over() {
    console.log('button over');
}
function out() {
    console.log('button out');
}


function restartLevel(state) {

    setTimeout(function () {
        game.state.start(state);
    }, 3000);

}

function killEnemy(enemy) {
    enemy.direction = 0;
    enemy.isAlive = false;
    enemy.body.velocity.y = 100;

}

function killPlayer(player, other) {
    //Jeśli to z czym zderzył się gracz (other) ma ustawione isEnemy na true to..
    if (other.isEnemy && (player.body.touching.left || player.body.touching.right)) {
        console.log(player.body.touching);
        player.body.velocity.x = 0;
        player.body.velocity.y = -600;
        player.isAlive = false;
        game.camera.unfollow();
        fx.play('mario_death');
        lives--;
        if (lives > 0) {
            restartLevel("Level_1");
        }
        else {
            lives = 5;
            restartLevel("Main");
        }

    }
}

function changeEnemyDirection(player, enemy) {
    enemy.direction = - enemy.direction;
}
function collectDiamond(player, diamond) {
    diamond.kill();
    score += 10;
    scoreText.text = 'Score' + score;
}