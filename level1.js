GameManager.Level_1.prototype = {
    preload: function() {
        game.load.image('sky', 'assets/mario/images/sky.png');
        game.load.image('ground', 'assets/mario/images/platform.png');
        game.load.image('diamond', 'assets/mario/images/diamond.png');
        game.load.image('bullet', 'assets/mario/images/bullet.png');
        game.load.spritesheet('woof', 'assets/mario/images/woof.png', 32, 32);
        game.load.spritesheet('enemy_stop', 'assets/mario/images/enemy_stop.png', 32, 32);
        game.load.audio('mario_samples', 'assets/mario/audio/mario_samples.mp3');
    },
    create: function() {
        { // Tworzenie tła i elementów do chodzenia
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.add.tileSprite(0, 0, 1900, 1200, 'sky');

            platforms = game.add.group();
            platforms.enableBody = true;

            //GLEBA
            ground = platforms.create(0, 550, 'ground');
            ground.scale.setTo(5, 2);
            ground.body.immovable = true;

            //LEDGESY
            ledge = platforms.create(400, 450, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(-75, 350, 'ground');
            ledge.body.immovable = true;

            //NOWO DODANE - stosowanie funkcji do tworzenia ledges
            CreateLedge(900, 400, 0.2, 1, 'ground');
            CreateLedge(1000, 300, 0.3, 1, 'ground');
            CreateLedge(1150, 230, 0.5, 1, 'ground');
            CreateLedge(1400, 250, 2, 1, 'ground');

        } { //DODAWANIE GRACZA
            player = game.add.sprite(32, 32, 'woof');
            game.physics.arcade.enable(player);
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 800;
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            player.animations.add('left', [0, 1], 10, true);
            player.animations.add('right', [2, 3], 10, true);
            player.isAlive = true;
        } { // Dodawanie wrogów i ograniczników
            enemies = game.add.group(); // Grupa dla wrogów ( bo będzie ich kilku )
            enemy_obstacles = game.add.group(); // Grupa ograniczników dla wrogów
            enemy_obstacles.enableBody = true;

            CreateEnemy(650, 420, 0.2, 800, 1, 100, "woof", -100, 100);


        } { // Tworzenie diamentów 
            diamonds = game.add.group();
            diamonds.enableBody = true;
            for (var i = 0; i < 12; i++) {
                diamond = diamonds.create(i * 70, 0, 'diamond');
                diamond.body.gravity.y = 1000;
                diamond.body.bounce.y = 0.3 + Math.random() * 0.2;
            }
        } { // Zerowanie punktów, ustawianie opcji świata i kamery
            scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
            scoreText.fixedToCamera = true; // Przyklej do ekranu
            scoreText.cameraOffset.setTo(0, 0); // .. z offsetem
            cursors = game.input.keyboard.createCursorKeys();
            score = 0;
            //Świat
            game.world.setBounds(0, 0, 1920, 1200);
            game.camera.follow(player);
        }
        //AUDIO
        {

            if (music.isPlaying == false && mute == 0) {
                music.play();
            }
        } { // HUD - życia i BuffBar
            for (var i = 0; i < lives; i++) {
                diamond = diamonds.create(100 + i * 70, 40, 'woof');
                diamond.fixedToCamera = true; // Przyklej do ekranu
            }
            var barConfig = {
                width: 250,
                height: 40,
                x: 200,
                y: 100,
                bg: {
                    color: '#5351cc'
                },
                bar: {
                    color: '#7a58bc'
                },
                animationDuration: 200,
                flipped: false
            };

            manaBar = new HealthBar(this.game, barConfig);
            manaBar.setPercent(buff);
            manaBar.setFixedToCamera(true); // Przyklej do ekranu
        } { //Particles
            emitter = game.add.emitter(0, 0, 100);

            emitter.makeParticles('diamond');
            emitter.gravity = 200;
        } { //STRZELANIE
            //  Creates 30 bullets, using the 'bullet' graphic
            weapon = game.add.weapon(30, 'bullet');
            weapon.bullets.enableBody = true;

            //  The bullet will be automatically killed when it leaves the world bounds
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

            //  The speed at which the bullet is fired
            weapon.bulletSpeed = 600;

            //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
            weapon.fireRate = 100;

            //weapon.trackSprite(player, 0, 0, true);
            fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
        }
    },
    particleBurst: function(player, pointer) {

        //  Position the emitter where the mouse/touch event was
        emitter.x = pointer.x;
        emitter.y = pointer.y;
        emitter.minParticleSpeed.setTo(0, -800);
        emitter.minParticleScale = 0.2;
        emitter.maxParticleScale = 0.7;
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        emitter.start(true, 2000, null, 10);
        buff += 25;
        manaBar.setPercent(buff);

    },
    update: function() {
        { // Diamenty mają zawsze kolidować z platformami a wrogowie z ich ogranicznikami
            game.physics.arcade.collide(diamonds, platforms);
            game.physics.arcade.collide(enemy_obstacles, enemies, changeEnemyDirection, null, this);
        }

        game.physics.arcade.overlap(weapon.bullets, enemies, killEnemy, null, this);

        // Jeśli gracz jest żywy to pozwól mu sterować
        if (player.isAlive) {
            //Jeśli gracz zajdzie na diament, wywołaj funkcję collectDiamond i prześlij do niej NIC oraz gracza
            game.physics.arcade.overlap(player, diamonds, this.particleBurst, null, this);
            game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
            //Jeśli gracz jest żywy to ma kolidować z platformami
            game.physics.arcade.collide(player, platforms);
            if (game.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {
                player.body.velocity.x = -150; // Daj graczowi prędkość w osi x
                player.animations.play('left'); // i graj animację LEWO
                weapon.fireAngle = 180;


            } else if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.animations.play('right');
                weapon.fireAngle = 0;

            } else {
                // Jeśli gracz nie naciska ani LEFT ani RIGHT to zatrzymaj go w osi x
                player.animations.stop();
                player.body.velocity.x = 0;
            }
            //Jeśli wciskasz strzałkę do góry i jednocześnie gracz styka się z czymś od spodu, skocz.
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -400;
            }

            { //Strzelanie
                if (fireButton.isDown) {

                    if (buff >= 100 && canShoot == true) {
                        buff -= 100;
                        manaBar.setPercent(buff);
                        weapon.fire(player);
                        canShoot = false;
                        soundManager('turtle_kill');
                    }
                }
                if (!fireButton.isDown) {
                    canShoot = true;
                }
            }
        }

        if (score == 120) {
            //alert("U WIN m8");
            music.stop();
            soundManager("mario_win");
            score = 0;
        } { // ENEMIES LOGIC     

            // Pętla która sprawdza wszystkich wrogów
            enemies.forEach(function(enemy) {
                //Jeśli gracz jest żywy to ma kolidować z wrogami ( z grupą )
                if (player.isAlive && enemy.isAlive) {
                    game.physics.arcade.collide(enemy, player);
                }
                //Każdemu wrogowi z osobna daj prędkość zależną od jego direction (pomnóż ją * 150)
                enemy.body.velocity.x = -150 * enemy.direction;
                if (enemy.direction == -1) {
                    enemy.animations.play('right');

                } else if (enemy.direction == 1) {
                    enemy.animations.play('left');
                }
                //Collider na głowie wroga, jeśli wróg zetknie się z czymś od góry (jedyna możliwość to z playerem)
                if (enemy.body.touching.up) {
                    // Rozpędź wroga w dół, ustaw touching.up na false (bo będzie bug...)
                    player.body.velocity.y = -200;
                    enemy.body.touching.up = false;
                    //zabij wroga (ta funkcja jest w global_stuff bo będzie uniwersalna dla wszystkich plansz)
                    killEnemy(null, enemy);

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
    render: function() {
        game.debug.pointer(game.input.activePointer);
    }
};