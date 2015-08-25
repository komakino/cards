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