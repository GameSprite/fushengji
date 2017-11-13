
//game state
function game(){
    
    this.state = [];
    this.index = -1;
    
};

game.prototype.push = function(fn){

    fn && this.state.push(fn);    

};

game.prototype.next = function(){
    
    if(++this.index >= this.state.length)
    {
        this.index = this.state.length - 1;
        
        console.log("global state at the end.");
    
        return;
    }
    
    var fn = this.state[this.index];
    
    fn && fn();
    
};

game.prototype.prev = function(){
    
    if(--this.index < 0)
    {
        this.index = -1;
        
        console.log("global state at the begin.");
    
        return;
    }
    
    var fn = this.state[this.index];
    
    fn && fn();
    
};

game.prototype.goto = function (index) {
    if (index >= 0 && index < this.state.length) {
        this.index = index;
        var fn = this.state[this.index];
        fn && fn();
    }
}

game.prototype.start = function(){
    this.next();
}

var _game = new game;

exports.push = function(){
    
    _game.push.apply(_game,arguments);
    
};

exports.start = function(){
    
    global.next = function(){
        
        _game.next();
        
    }
    
    global.prev = function(){
        
        _game.prev();
        
    }

    global.goto = function (i) {

        _game.goto(i);

    }
    
    _game.start();
    
}

