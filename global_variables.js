

//Game options
var mute = 0;


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




