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