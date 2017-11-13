//
// Javascript Bindigns helper file
//
var emitter = require("../lib/events").EventEmitter;
global.events = new emitter();
// DO NOT ALTER THE ORDER
require('./jsb_constants_cocos2d');
require('./jsb_constants_gl');
require('./jsb_constants_cocosbuilder');
