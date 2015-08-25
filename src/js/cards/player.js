function Player(game,name){
    this.game = game;
    this.name = name;
    this.hand = new Hand(game,this);
}
Player.e = {
    wrongType: $lambda("NotAPlayer"),
}

Player.prototype.giveHand = function(hand){
    if(!(hand instanceof Hand)) throw Hand.e.wrongType();
    hand.owner = this;
}

Player.prototype.foldHand = function(){
    this.hand = null;
}

Player.prototype.canBeDealt = function(){
    return this.hand.cards.length < this.game.getRule('handLength');
}

Player.prototype.deal = function(card){
    if(!(card instanceof Card)) throw Card.e.wrongType();
    this.hand.addCard(card);
    return true;
}
