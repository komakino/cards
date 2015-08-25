function Deck(shuffle){

    this.shuffled = false;
    this.cards = [];
    this.discards = [];

    var suits = {
            0: {
                bit: 1,
                name: 'hearts',
                code: 'hearts',
                color: 'red',
            },
            1: {
                bit: 2,
                name: 'spades',
                code: 'spades',
                color: 'black',
            },
            2: {
                bit: 4,
                name: 'diamonds',
                code: 'diams',
                color: 'red',
            },
            3: {
                bit: 8,
                name: 'clubs',
                code: 'clubs',
                color: 'black',
            },
        }


    for(var i=0;i<4;i++){
        for(var j=2;j<=14;j++){
            this.cards.push(new Card(this,j,suits[i]));
        }
    }

    shuffle && this.shuffle();
}

Deck.prototype = new BaseClass();
Deck.prototype.constructor = Deck;

Deck.e = {
    wrongType: $lambda("NotADeck"),
    empty: $lambda("DeckIsEmpty"),
}

Deck.prototype.shuffle = function(){
    for(var i=52*52;i>0;i--){
        this.cards.reverse();
        this.cards.push(this.drawCard(true));
    }

    this.shuffled = true;
}

Deck.prototype.drawCard = function(random){
    if(!this.cards.length) throw Deck.e.empty();
    if(random){
        var i = Math.floor((Math.random() * this.cards.length-1) + 1);
        return this.cards.splice(i,1)[0];
    } else {
        return this.cards.pop();
    }
}

Deck.prototype.discard = function(card){
    this._assertType(card,Card);
    card.reset();
    this.discards.push(card);
}

Deck.prototype.dealCard = function(player){
    this._assertType(player,Player);
    if(player.canBeDealt()){
        card = this.drawCard();
        return player.deal(card);
    }
}
