function Class($construct,$properties,$extends,$describe,$errors){
    function _merge(a,b){ for(v in b) b.hasOwnProperty(v) && (a[v] = b[v])}
    function _grab(obj,prop){
        var temp = obj[prop];
        delete obj[prop]
        return temp;
    }
    function _createError(name,defaultMessage){
        return Class({
            $extends: Error,
            $construct: function(message){
                Error.call(this);
                this.name = name;
                this.message = message || defaultMessage;
            },
        })
    }

    if(typeof $construct == 'object'){
        $properties = $construct;
        $construct  = _grab($properties,'$construct');
        $extends    = _grab($properties,'$extends');
        $describe   = _grab($properties,'$describe');
        $errors     = _grab($properties,'$errors');
    }

    $construct  || ($construct = new Function());
    $extends    || ($extends = Class);

    $construct.$lineage = $extends.$lineage ? $extends.$lineage.slice(0) : [];
    $construct.$lineage.push($extends);

    function temp() { this.constructor = $construct; }
    temp.prototype = $extends.prototype;
    $construct.prototype = new temp;

    $construct.$childOf     = function(parent){ return this.$lineage && this.$lineage.indexOf(parent) > -1;}
    $construct.$parentOf    = function(parent){ return parent.$lineage && parent.$lineage.indexOf(this) > -1;}
    $construct.$parent      = $extends;

    if($errors){
        $construct.$errors = {};
        for(name in $errors) 
            $errors.hasOwnProperty(name) && ($construct.$errors[name] = (typeof $errors[name] == 'function') ? $errors[name] : _createError(name,$errors[name]))
    }

    _merge($construct.prototype,$properties);
    $describe && Object.defineProperties($construct.prototype,$describe);

    return $construct;
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
            throw new TypeError("Not a " + type.name + ': ' + String(value));
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
