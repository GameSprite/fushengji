
//debug ui
var open_flag = true;


var util = require("../lib/util");
var game_utils = require("./game_utils");

var show_time = 30;     //seconds
var enter_num = 40;

//ui log
var debug_ttf;
function ui_log() {

    var str = util.format.apply(this, arguments);

    var run_scene = cc.Director.getInstance().getRunningScene();
    if (debug_ttf) {
        debug_ttf.removeFromParent();
    }

    var size = cc.p.resolution(20, 0);

    debug_ttf = cc.LabelTTF.create(game_utils.strenter(str, enter_num), "", size.x);

    debug_ttf.setAnchorPoint(cc.p(0, 0))
    debug_ttf.setPosition(cc.p(10, 10));
    debug_ttf.setColor(cc.c3b(0, 255, 0));

    debug_ttf.runAction(cc.Sequence.create(cc.DelayTime.create(show_time), cc.Hide.create()));

    run_scene.addChild(debug_ttf, cc.zorderBase * cc.layer_debug);
}


var is_open = false;

exports.open = function () {

    //check we need open debug mode
    if (open_flag) {

        if (!is_open) {

            console.log2 = ui_log;

            //let fps show
            cc.Director.getInstance().setDisplayStats(true);
            setTimeout(function () {
                cc.Director.getInstance().setDisplayStats(false);
            }, show_time * 1000);

            is_open = true;
        }
    }
}