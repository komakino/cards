var Player = new Class({
    $extends: BaseClass,
    $construct: function Player(game,name){
        this.game = game;
        this.name = name;
        this.hand = new Hand(game,this);
    },
    giveHand: function(hand){
        this._assertType(hand,Hand);
        hand.owner = this;
    },
    foldHand: function(){
        this.hand = null;
    },
    canBeDealt: function(){
        return this.hand.cards.length < this.game.getRule('handLength');
    },
    deal: function(card){
        this._assertType(card,Card);
        this.hand.addCard(card);
        return true;
    }
});
