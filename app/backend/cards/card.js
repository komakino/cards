var Card = new Class({
    $extends: BaseClass,
    $construct: function Card(deck,value,suit){
        this.deck = deck;
        this.value = value;
        this.suitValue = suit.name;
        this.suit = suit;
        this.rank = this._valToRank(value);
        this.selected = false;
    },
    _valToRank: function(val){
        switch (val){
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
            case 14: return 'A';
            default: return val;
        }
    },
    discard: function(){
        this.deck.discard(this);
    },
    reset: function(){
        this.selected = false;
    },
    select: function(player){
        if(player && $has(player.hand.cards,this)) this.selected = !this.selected;
    },
});

