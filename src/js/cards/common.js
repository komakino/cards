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
