GameManager.Level_1.prototype = {

    preload: function () {
        game.load.image('sky', 'assets/mario/images/sky.png');
        game.load.image('ground', 'assets/mario/images/platform.png');
        game.load.image('diamond', 'assets/mario/images/diamond.png');
        game.load.spritesheet('woof', 'assets/mario/images/woof.png', 32, 32);
        game.load.audio('mario_death', 'assets/mario/audio/mario_death.mp3');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'sky');

        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0, 550, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        ledge = platforms.create(400, 450, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-75, 350, 'ground');
        ledge.body.immovable = true;

        { //DODAWANIE GRACZA
            player = game.add.sprite(32, 32, 'woof');
            game.physics.arcade.enable(player);
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 800;
            player.body.collideWorldBounds = true;
            player.animations.add('left', [0, 1], 10, true);
            player.animations.add('right', [2, 3], 10, true);
            player.isAlive = true;
        }
        { // Dodawanie wrogów
            enemies = game.add.group(); // Grupa dla wrogów ( bo będzie ich kilku )
            for (var i = 0; i < 3; i++) {
                enemy = game.add.sprite(120 + i * 100, 500, 'woof');

                game.physics.arcade.enable(enemy);
                enemy.body.bounce.y = 0.2;
                enemy.body.gravity.y = 800;
                enemy.body.collideWorldBounds = true;
                enemy.direction = 1;
                enemy.isEnemy = 1;
                enemy.animations.add('left', [0, 1], 10, true);
                enemy.animations.add('right', [2, 3], 10, true);
                enemies.add(enemy);
            }

        }

        { // Dodawanie ogranicznika dla wrogów
            enemy_obstacles = game.add.group(); // Grupa ograniczników dla wrogów
            enemy_obstacles.enableBody = true;

            enemy_obstacle = enemy_obstacles.create(500, 500, 'woof');
            enemy_obstacle.body.immovable = true;

            enemy_obstacle = enemy_obstacles.create(0, 500, 'woof');
            enemy_obstacle.body.immovable = true;

        }

        diamonds = game.add.group();
        diamonds.enableBody = true;
        for (var i = 0; i < 12; i++) {
            diamond = diamonds.create(i * 70, 0, 'diamond');
            diamond.body.gravity.y = 1000;
            diamond.body.bounce.y = 0.3 + Math.random() * 0.2;
        }

        scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
        cursors = game.input.keyboard.createCursorKeys();
        score = 0;


        //Świat
        game.world.setBounds(0, 0, 1920, 1200);
        game.camera.follow(player);

        //AUDIO
        {
            fx = game.add.audio('mario_death');
            fx.allowMultiple = false;
            fx.addMarker('mario_death', 0, 5.0);
        }

        console.log(lives);

    },

    update: function () {


        game.physics.arcade.collide(diamonds, platforms);

        player.body.velocity.x = 0;
        if (player.isAlive) {
            game.physics.arcade.overlap(player, diamonds, this.collectDiamond, null, this);
            game.physics.arcade.collide(player, platforms);
            if (cursors.left.isDown) {
                player.body.velocity.x = -150;
                player.animations.play('left');

            } else if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.animations.play('right');
            }
            else {
                player.animations.stop();
            }
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -400;
            }
        }



        if (score == 120) {
            alert("U WIN m8");
            score = 0;
        }

        {// ENEMIES LOGIC
            game.physics.arcade.collide(enemies, platforms);
            if (player.isAlive) {
                game.physics.arcade.collide(enemies, player);
            }

            enemies.forEach(function (enemy) {
                enemy.body.velocity.x = -150 * enemy.direction;
                if (enemy.direction == -1) {
                    enemy.animations.play('right');
                }
                else if (enemy.direction == 1) {
                    enemy.animations.play('left');
                }


                //Collider na głowie wroga
                if (enemy.body.touching.up) {
                    
                    player.body.velocity.y = -200;
                    enemy.body.touching.up=false;
                    enemy.kill();
                }
            });
            game.physics.arcade.collide(enemy_obstacles, enemies, this.changeEnemyDirection, null, this);



            //Wykrywanie kolizji między graczem a wrogiem
            if (player.isAlive == true) {
                player.body.onCollide = new Phaser.Signal();
                player.body.onCollide.add(this.killPlayer, this, this);
            }


        }
    },
    killPlayer: function (player, other) {
        if (other.isEnemy && (player.body.touching.left || player.body.touching.right)) {
            console.log(player.body.touching);
            player.body.velocity.x = 0;
            player.body.velocity.y = -600;
            player.isAlive = false;
            game.camera.unfollow();
            fx.play('mario_death');
            lives--;
            if(lives>0)
            {
                restartLevel("Level_1");
            }
            else{
                lives=5;
                restartLevel("Main");
            }

        }
    },

    changeEnemyDirection: function (player, enemy) {
        enemy.direction = - enemy.direction;
    },
    collectDiamond: function (player, diamond) {
        diamond.kill();
        score += 10;
        scoreText.text = 'Score' + score;
    },
    render: function () {
        game.debug.pointer(game.input.activePointer);
    }

};