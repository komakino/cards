
function Card(value,suit){

    function _valToRank(val){
        switch (val){
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
            case 14: return 'A';
            default: return val;
        }
    }

    this.value = value;
    this.suitValue = suit.name;
    this.suit = suit;
    this.rank = _valToRank(value);
    this.selected = false;
}

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

function Hand(){
    this.cards = [];
    this.strength = {};
}

Hand.prototype.addCard = function(card){
    if (card instanceof Card) this.cards.push(card);
    else throw 'NotACard';
}

Hand.prototype.discardCard = function(card){
    var i = this.cards.indexOf(card);
    if(i > -1) this.cards.splice(i,1);
}

Hand.prototype.evaluate = function(){
    var cs = [],
        ss = [];

    this.cards.map(function(card){
        cs.push(card.value);
        ss.push(card.suit.bit);
    });

    // http://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math
    var v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
    for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
    v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
    v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);

    var rank=[7,8,4,5,0,1,2,9,3,6];
    var hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
           "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House" ];

    this.strength = {
        value: v,
        rank: rank[v],
        suit: v == 1 || v == 3 ? ss[0] : null,
        high: Math.max.apply(null, cs),
        string: hands[v] + (s == 0x403c?" (Ace low)":""),
    };
}