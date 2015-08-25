function Hand(game,player){
    this._assertType(game,Game);
    this._assertType(player,Player);

    this.game = game;
    this.player = player;
    this.cards = [];
    this.strength = {};
}

Hand.prototype = new BaseClass();
Hand.prototype.constructor = Hand;

Hand.prototype.addCard = function(card){
    this._assertType(card,Card);
    this.cards.push(card);
}

Hand.prototype.discardCard = function(card){
    this._assertType(card,Card);
    var i = this.cards.indexOf(card);
    if(i > -1) {
        this.cards.splice(i,1)[0].discard();
    } else throw Card.e.NotInHand();
}

Hand.prototype.swapCards = function(){
    $foreach(this.cards,function(card){
        if(card.selected){
            this.discardCard(card);
        }
    },this);

    while(this.cards < this.game.getRule('handLength')){

    }
}