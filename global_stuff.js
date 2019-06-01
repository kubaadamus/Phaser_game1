//Game options
var mute = 0;
var mute_fx = 0;
var lives = 3;
var music;
var buff = 0;
var emitter;
var canShoot = true;

var LabelButton = function(game, x, y, key, label, name, callback, callbackContext, overFrame, outFrame, downFrame,

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
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function(label) {
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

    setTimeout(function() {
        game.state.start(state);
    }, 3000);

}

function killEnemy(bullet, enemy) {

    if (bullet != null) {
        enemy.health -= 50;
        bullet.kill();
    } else {
        enemy.health = 0;
    }


    if (enemy.health <= 0) {
        enemy.direction = 0;
        enemy.isAlive = false;
        enemy.body.velocity.y = -400;
        soundManager("turtle_kill");
    }

}

function killPlayer(player, other) {
    //Jeśli to z czym zderzył się gracz (other) ma ustawione isEnemy na true to..
    if (other.isEnemy && (player.body.touching.left || player.body.touching.right)) {
        console.log(player.body.touching);
        player.body.velocity.x = 0;
        player.body.velocity.y = -600;
        player.isAlive = false;
        game.camera.unfollow();
        soundManager("mario_death");
        music.stop();
        lives--;
        if (lives > 0) {
            restartLevel("Level_1");
        } else {
            lives = 5;
            setTimeout(function() {
                soundManager("game_over");
                restartLevel("Main");
            }, 3000);
        }
    }
}

function changeEnemyDirection(player, enemy) {
    enemy.direction = -enemy.direction;
}

function collectDiamond(player, diamond) {
    diamond.kill();
    score += 10;
    scoreText.text = 'Score' + score;
    soundManager("collect_coin");
}


function soundManager(sampleName) {
    fx = game.add.audio('mario_samples');
    fx.allowMultiple = true;
    fx.addMarker('mario_death', 26.1, 5.0);
    fx.addMarker('game_over', 8, 3.7);
    fx.addMarker('collect_coin', 19.5, 1.0);
    fx.addMarker('turtle_kill', 42.6, 0.2);
    fx.addMarker('mario_win', 12.7, 5.6);
    fx.play(sampleName);
}



//NOWO DODANE 1 -SKRYPT POBIERANIA DANYCH Z BAZY
function XHR(SQL) {
    var request = new XMLHttpRequest();
    console.log("http://imprezpol.cba.pl/xhr_script.php?" + SQL);
    request.open("GET", "http://imprezpol.cba.pl/xhr_script.php?" + SQL, false);
    request.send(null);
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    }
}
//================================================//


// NOWO DODANE - funkcja generująca ledges
function CreateLedge(x, y, width, height, sprite) {
    ledge = platforms.create(x, y, sprite);
    ledge.scale.setTo(width, height);
    ledge.body.immovable = true;
}
//===========================================//


// NOWO DODANE - Tworzenie przeciwników i ograniczników
function CreateEnemy(x, y, bounce, gravity, direction, health, spritesheet, obstacle_left, obstacle_right) {
    enemy = game.add.sprite(x, y, spritesheet);

    game.physics.arcade.enable(enemy);
    enemy.body.bounce.y = bounce;
    enemy.body.gravity.y = gravity;
    enemy.body.collideWorldBounds = true;
    enemy.direction = direction;
    enemy.isEnemy = 1;
    enemy.health = health;
    enemy.isAlive = true;
    enemy.animations.add('left', [0, 1], 10, true);
    enemy.animations.add('right', [2, 3], 10, true);
    enemies.add(enemy);

    enemy_obstacle = enemy_obstacles.create(enemy.x + obstacle_left, enemy.y, 'enemy_stop');
    enemy_obstacle.body.immovable = true;

    enemy_obstacle = enemy_obstacles.create(enemy.x + obstacle_right, enemy.y, 'enemy_stop');
    enemy_obstacle.body.immovable = true;
}