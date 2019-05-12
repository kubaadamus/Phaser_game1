GameManager.Level_1.prototype = {

    preload: function () {
        game.load.image('sky', 'assets/mario/images/sky.png');
        game.load.image('ground', 'assets/mario/images/platform.png');
        game.load.image('diamond', 'assets/mario/images/diamond.png');
        game.load.spritesheet('woof', 'assets/mario/images/woof.png', 32, 32);
        game.load.audio('mario_death', 'assets/mario/audio/mario_death.mp3');
    },
    create: function () {
        { // Tworzenie tła i elementów do chodzenia
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
        }
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
            for (var i = 0; i < 1; i++) {
                enemy = game.add.sprite(120 + i * 100, 500, 'woof');

                game.physics.arcade.enable(enemy);
                enemy.body.bounce.y = 0.2;
                enemy.body.gravity.y = 800;
                enemy.body.collideWorldBounds = true;
                enemy.direction = 1;
                enemy.isEnemy = 1;
                enemy.isAlive = true;
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
        { // Tworzenie diamentów 
            diamonds = game.add.group();
            diamonds.enableBody = true;
            for (var i = 0; i < 12; i++) {
                diamond = diamonds.create(i * 70, 0, 'diamond');
                diamond.body.gravity.y = 1000;
                diamond.body.bounce.y = 0.3 + Math.random() * 0.2;
            }
        }
        { // Zerowanie punktów, ustawianie opcji świata i kamery
            scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
            cursors = game.input.keyboard.createCursorKeys();
            score = 0;
            //Świat
            game.world.setBounds(0, 0, 1920, 1200);
            game.camera.follow(player);
        }
        //AUDIO
        {
            fx = game.add.audio('mario_death');
            fx.allowMultiple = false;
            fx.addMarker('mario_death', 0, 5.0);
        }
    },
    update: function () {

        { // Diamenty mają zawsze kolidować z platformami a wrogowie z ich ogranicznikami
            game.physics.arcade.collide(diamonds, platforms);
            game.physics.arcade.collide(enemy_obstacles, enemies, changeEnemyDirection, null, this);
        }
        // Jeśli gracz jest żywy to pozwól mu sterować
        if (player.isAlive) {
            //Jeśli gracz zajdzie na diament, wywołaj funkcję collectDiamond i prześlij do niej NIC oraz gracza
            game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
            //Jeśli gracz jest żywy to ma kolidować z platformami
            game.physics.arcade.collide(player, platforms);
            if (cursors.left.isDown) {
                player.body.velocity.x = -150; // Daj graczowi prędkość w osi x
                player.animations.play('left'); // i graj animację LEWO

            } else if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.animations.play('right');
            }
            else {
                // Jeśli gracz nie naciska ani LEFT ani RIGHT to zatrzymaj go w osi x
                player.animations.stop();
                player.body.velocity.x = 0;
            }
            //Jeśli wciskasz strzałkę do góry i jednocześnie gracz styka się z czymś od spodu, skocz.
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -400;
            }
        }

        if (score == 120) {
            alert("U WIN m8");
            score = 0;
        }

        {// ENEMIES LOGIC

            //Jeśli gracz jest żywy to ma kolidować z wrogami ( z grupą )
            if (player.isAlive) {
                game.physics.arcade.collide(enemies, player);
            }

            // Pętla która sprawdza wszystkich wrogów
            enemies.forEach(function (enemy) {
                //Każdemu wrogowi z osobna daj prędkość zależną od jego direction (pomnóż ją * 150)
                enemy.body.velocity.x = -150 * enemy.direction;
                if (enemy.direction == -1) {
                    enemy.animations.play('right');
                }
                else if (enemy.direction == 1) {
                    enemy.animations.play('left');
                }
                //Collider na głowie wroga, jeśli wróg zetknie się z czymś od góry (jedyna możliwość to z playerem)
                if (enemy.body.touching.up) {
                    // Rozpędź wroga w dół, ustaw touching.up na false (bo będzie bug...)
                    player.body.velocity.y = -200;
                    enemy.body.touching.up = false;
                    //zabij wroga (ta funkcja jest w global_stuff bo będzie uniwersalna dla wszystkich plansz)
                    killEnemy(enemy);
                }
                //Jeśli wróg jest żywy to ma kolidować z platformami
                if (enemy.isAlive) {
                    game.physics.arcade.collide(enemy, platforms);
                }

            });
            //Wykrywanie kolizji między graczem a wrogiem. Jeśli nastąpi kolizja to uruchom funkcję killPlayer
            if (player.isAlive == true) {
                player.body.onCollide = new Phaser.Signal();
                player.body.onCollide.add(killPlayer, this, this); // i prześlij do niej zarówno gracza jak i to z czym się zderzył
            }
        }
    },


    render: function () {
        game.debug.pointer(game.input.activePointer);
    }

};