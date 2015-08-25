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
function Class(fn,properties,parent,descriptors){
    function _merge(a,b){ for(v in b) b.hasOwnProperty(v) && (a[v] = b[v])}
    function _grab(obj,prop){
        var temp = obj[prop];
        delete obj[prop]
        return temp;
    }

    if(typeof fn == 'object'){
        properties = fn;
        fn = _grab(properties,'$construct');
        parent = _grab(properties,'$extends');
        descriptors = _grab(properties,'$describe');
    }

    if(parent){
        function temp() { this.constructor = fn; }
        temp.prototype = parent.prototype;
        fn.prototype = new temp;
        fn.$parent = parent.prototype;
    }
    console.log(fn);

    _merge(fn.prototype,properties);
    descriptors && Object.defineProperties(fn.prototype,descriptors);

    return fn;
}

var BaseClass = new Class({
    $construct: function BaseClass(){},
    _setProperty: function(key,value){
        this[key] = value;
    },
    _setProperties: function(properties){
        $foreach(properties,function(value,key){
            this._setProperty(key,value);
        },this);
    },
    _assertType: function(value,type){
        if(!(value instanceof type)){
            console.log("Not a %s:",type.name,value,arguments.callee.caller.prototype);
            throw "NotA"+type.name;
        }
    }
});

function $isType(subject,types,inherit){
    if(!(types instanceof Array)) types = [types];
    for (var i = 0; i < types.length; i++) {
        if((inherit && subject instanceof types[i]) || (subject.constructor == types[i])) return true;
    };
    return false;
}

function $assertType(subject,types,inherit){
    if(!(types instanceof Array)) types = [types];
    if($isType(subject,types,inherit)) return;
    var string = types.map(function(type){
        return type.name;
    }).join('_or_');

    throw "NotOfType_" + string;
}

function $lambda(value){
    return function(){return value;}
}

// For future enhancement
var $delay = setTimeout;
var $repeat = setInterval;

function $extend(object /*, ... */){
    arguments.shift();
    $foreach(arguments,function(value, key){

    },this);
}

function $foreach(object, iterator, context){
   if(object === undefined || object === null || !object.constructor) return false;
    switch(object.constructor.name){
        case 'Array':
            for(var i=object.length-1;i>=0;i--) iterator.call(context,object[i],i);
            break;
        case 'Object':
            for(key in object) object.hasOwnProperty(key) && iterator.call(context,object[key],key);
            break;
    }
}

function $has(arr,value){
    if(!(arr instanceof Array)) return false;
    else return arr.indexOf(value) > -1;
}

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

var Game = new Class({
    $extends: BaseClass,
    $construct: function Game(){
        this._setProperties({
            players: [],
            deck: null,
            dealer: null,
            turn: null,
        });

        this.rules = {
            handLength: 5,
        }

    },
    addPlayer: function(player){
        this._assertType(player,Player);
        this.players.push(player);
        !this.dealer && this.setDealer(player);
    },
    start: function(){
        this.deck = new Deck(true);
        this.deal();
        this.shiftTurn();
    },
    getRule: function(prop){
        return this.rules[prop];
    },
    getNextPlayer: function(player){
        this._assertType(player,Player);
        var i = this.players.indexOf(player);
        if(this.players.length == (i+1)) return this.players[0];
        else return this.players[i+1];
    },
    getNextInTurn: function(){
        return this.getNextPlayer(this.turn || this.dealer);
    },
    setDealer: function(player){
        this._assertType(player,Player);
        this.dealer = player;
    },
    getDealer: function(player){
        this._assertType(player,Player);
        return this.dealer;
    },
    shiftDealer: function(){
        this.dealer = this.getNextPlayer(this.dealer);
    },
    shiftTurn: function(){
        this.turn = this.getNextInTurn();
    },
    compareHands: function(hand1,hand2){
        if(!(hand1 instanceof Hand)) throw Hand.e.wrongType();
        if(!(hand2 instanceof Hand)) throw Hand.e.wrongType();
    },
    deal: function(){
        var dealing = true;
        while(dealing){
            dealing = false;
            for(var i=0;i<this.players.length;i++){
                var player = this.players[i];
                this.dealPlayer(player) && (dealing = true);
            }
        }
    },
    dealPlayer: function(player){
        this._assertType(player,Player);
        if(player.hand.cards.length < this.getRule('handLength')){
            return this.deck.dealCard(player);
        }    
    },
    evaluateHand: function(hand){
        this._assertType(hand,Hand);
        var cs = [],
            ss = [];

        hand.cards.map(function(card){
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

        return {
            value: v,
            rank: rank[v],
            suit: v == 1 || v == 3 ? ss[0] : null,
            high: Math.max.apply(null, cs),
            string: hands[v] + (s == 0x403c?" (Ace low)":""),
        };
    },

});
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

//# sourceMappingURL=cards.js.map