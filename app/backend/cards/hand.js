var Hand = new Class({
    $extends: BaseClass,
    $errors: {
        NotInHandError: 'Card is not in hand!',
    },
    $construct: function Hand(game,player){
        this._assertType(game,Game);
        this._assertType(player,Player);

        this.game = game;
        this.player = player;
        this.cards = [];
        this.strength = {};
    },
    addCard: function(card){
        this._assertType(card,Card);
        this.cards.push(card);
    },
    discardCard: function(card){
        this._assertType(card,Card);
        var i = this.cards.indexOf(card);
        if(i > -1) {
            this.cards.splice(i,1)[0].discard();
        } else throw new Card.$errors.NotInHandError();
    },
    swapCards: function(){
        $foreach(this.cards,function(card){
            if(card.selected){
                this.discardCard(card);
            }
        },this);

        this.game.dealPlayerFill(this.player);
    }
});