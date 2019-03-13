var config = {
    type: Phaser.AUTO,
    width: 944,
    height: 944,
    backgroundColor: '#00000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    }
};

var tint;
var p1, p2;
var cursor1, cursor2;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

//We load the "sprites" and sound
function preload ()
{
    this.load.image('motocycle', 'assets/motocycle.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.audio('mvt', 'assets/mvt.ogg');
}

function create ()
{
  //We add the sound the the scen (it will be used later)
    mvt = this.sound.add('mvt');

    //We create a player class
    var Player = new Phaser.Class({

        initialize:

        function Player (scene, x, y, tint)
        {
            this.h = config.height / 16;
            this.w = config.width / 16;
            this.color = tint;
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.motocycle = scene.add.group();

            this.head = this.motocycle.create(x * 16, y * 16, 'motocycle');
            this.head.setOrigin(0);

            this.head.tint = this.color;

            this.alive = true;

            this.speed = 100;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x * 16, y * 16);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction !== RIGHT)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction !== LEFT)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction !== DOWN)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction !== UP)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            //Update of the player position depending on its direction
            switch (this.heading)
            {
                case LEFT:
                    if (this.headPosition.x <= 0) {
                      console.log("LEFT");
                      this.suicide();
                    }
                    console.log(this);
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, this.w);
                    break;

                case RIGHT:
                    if (this.headPosition.x <= 0) {
                      console.log("RIGHT");
                      this.suicide();
                    }
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, this.w);
                    break;

                case UP:
                    if (this.headPosition.y <= 0) {
                      console.log("UP");
                      this.suicide();
                    }
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, this.h);
                    break;

                case DOWN:
                    if (this.headPosition.y <= 0) {
                      console.log("DOWN");
                      this.suicide();
                    }
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, this.h);
                    break;
            }

            this.direction = this.heading;

            Phaser.Actions.ShiftPosition(this.motocycle.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //collision detection with the wall (only the player with ITS OWN wall)
            var hitmotocycle = Phaser.Actions.GetFirst(this.motocycle.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitmotocycle)
            {
                alert('dead');
                this.alive = false;
                return false;
            }
            else
            {
                this.moveTime = time + this.speed;
                return true;
            }

        },

        suicide: function ()
        {
          alert('dead by suicide');
          this.alive = false;
        },

        wallcreation: function ()
        {
            var newPart = this.motocycle.create(this.tail.x, this.tail.y, 'wall');
            newPart.tint = this.color;
            newPart.setOrigin(0);
        }

    });

    p1 = new Player(this, 6, 4, 0x1E90FF);
    p2 = new Player(this, 10, 20, 0xDC143C);

    //Create the keyboard controls, default is arrow keys
    cursor1 = this.input.keyboard.createCursorKeys();
    cursor2 = this.input.keyboard.createCursorKeys();
    //create new controls for player2
    //AZERTY
    cursor2 = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.Z,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.Q,
      right:Phaser.Input.Keyboard.KeyCodes.D});
      //QWERTY
    /*cursor2 = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});*/
}

function update (time, delta)
{
    if (!p1.alive || !p2.alive)
    {
        return;
    }

    if (cursor1.left.isDown)
    {
        p1.faceLeft();
    }
    else if (cursor1.right.isDown)
    {
        p1.faceRight();
    }
    else if (cursor1.up.isDown)
    {
        p1.faceUp();
    }
    else if (cursor1.down.isDown)
    {
        p1.faceDown();
    }

    if (cursor2.left.isDown)
    {
        p2.faceLeft();
    }
    else if (cursor2.right.isDown)
    {
        p2.faceRight();
    }
    else if (cursor2.up.isDown)
    {
        p2.faceUp();
    }
    else if (cursor2.down.isDown)
    {
        p2.faceDown();
    }

    //collision with the other player's wall
    var hitmotocycle1 = Phaser.Actions.GetFirst(p1.motocycle.getChildren(), { x: p2.head.x, y: p2.head.y }, 1);
    var hitmotocycle2 = Phaser.Actions.GetFirst(p2.motocycle.getChildren(), { x: p1.head.x, y: p1.head.y }, 1);

    if (hitmotocycle1)
    {
        alert('p1 killed p2');

        p1.alive = false;
    }
    if (hitmotocycle2)
    {
        alert('p2 killed p1');

        p2.alive = false;
    }

    //We play the sound
    mvt.play();

    p1.wallcreation();
    p2.wallcreation();
    p1.update(time);
    p2.update(time);
}
