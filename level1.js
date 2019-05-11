GameManager.Level_1.prototype = {

    preload: function () {
        game.load.image('sky','assets/mario/images/sky.png');
        game.load.image('ground','assets/mario/images/platform.png');
        game.load.image('diamond','assets/mario/images/diamond.png');
        game.load.spritesheet('woof','assets/mario/images/woof.png',32,32);
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0,0,'sky');

        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0,game.world.height-64,'ground');
        ground.scale.setTo(2,2);
        ground.body.immovable=true;

        ledge = platforms.create(400,450,'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-75,350,'ground');
        ledge.body.immovable = true;

        player = game.add.sprite(32,game.world.height-150,'woof');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 800;
        player.body.collideWorldBounds = true;

        player.animations.add('left',[0,1],10,true);
        player.animations.add('right',[2,3],10,true);


        diamonds = game.add.group();
        diamonds.enableBody = true;
        for(var i = 0; i<12; i++)
        {
            diamond = diamonds.create(i * 70, 0, 'diamond');
            diamond.body.gravity.y = 1000;
            diamond.body.bounce.y = 0.3 + Math.random()*0.2;
        }

        scoreText = game.add.text(16,16,'',{fontSize: '32px',fill: '#000'});
        cursors = game.input.keyboard.createCursorKeys();
        score = 0;


        //Świat
        game.world.setBounds(0, 0, 1920, 1200);
        game.camera.follow(player);

    },

    update: function () {

        game.physics.arcade.collide(player,platforms);
        game.physics.arcade.collide(diamonds,platforms);
        game.physics.arcade.overlap(player,diamonds,this.collectDiamond,null,this);

        player.body.velocity.x = 0;

        if(cursors.left.isDown){
            player.body.velocity.x = -150;
            player.animations.play('left');

        }else if(cursors.right.isDown){
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else{
            player.animations.stop();
        }
        if(cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -400;
        }

        if(score==120)
        {
           alert("U WIN m8");
           score=0; 
        }

    },

    collectDiamond: function(player,diamond){
        diamond.kill();
        score += 10;
        scoreText.text = 'Score' + score;
    }

};