function Deck(shuffle){

    this.shuffled = false;
    this.cards = [];

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
            this.cards.push(new Card(j,suits[i]));
        }
    }

    shuffle && this.shuffle();
}

Deck.prototype.shuffle = function(){
    for(var i=52*52;i>0;i--){
        this.cards.reverse();
        this.cards.push(this.draw(true));
    }

    this.shuffled = true;
}

Deck.prototype.draw = function(random){
    if(!this.cards.length) throw 'DeckIsEmpty';
    if(random){
        var i = Math.floor((Math.random() * this.cards.length-1) + 1);
        return this.cards.splice(i,1)[0];
    } else {
        return this.cards.pop();
    }
}

Deck.prototype.deal = function(hand){
    !hand && (hand = new Hand());
    while(hand.cards.length < 5){
        hand.addCard(this.draw());
    }

    hand.evaluate();

    return hand;
}
