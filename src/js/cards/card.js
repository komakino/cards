function Card(deck,value,suit){

    function _valToRank(val){
        switch (val){
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
            case 14: return 'A';
            default: return val;
        }
    }

    this.deck = deck;
    this.value = value;
    this.suitValue = suit.name;
    this.suit = suit;
    this.rank = _valToRank(value);
    this.selected = false;
}

Card.e = {
    NotInHand: $lambda("NotInHand"),
}

Card.prototype.discard = function(){
    this.deck.discard(this);
}

Card.prototype.reset = function(){
    this.selected = false;
}

Card.prototype.select = function(player){
    if(player && $has(player.hand.cards,this)) this.selected = !this.selected;
}