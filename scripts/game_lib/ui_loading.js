// ui loading

var node = {};
var main_data;

var effect_node;

var touch_timeout;

var cur_scene = null;
var visible = false;

global.events.on('logout', function () {
    node.clean();
});

node.init = function () {
    //show at common layer
    this.setZOrder(cc.zorderBase * cc.layer_loading);

    //catch touch event
    this.setTouchEnabled(true);

    //set node as a swallow one
    this.setTouchMode(1);

    //set node a higher priority
    this.setTouchPriority(cc.layer_loading * cc.touchPriorityBase + cc.touchPriorityLayer);

    // create effect
    effect_node = global.createEffect('ui_main_load.json', true);
    effect_node.setPosition(cc.p.resolution(640, 360));
    node.addChild(effect_node);
}

node.clean = function () {
    cur_scene = null;
    delete this._layerlv;
}

// forbid all other touch
node.onTouchBegan = function (touch) {

    if (this.isVisible()) {
        return true;
    }
    else {
        return false;
    }

}

node.show = function () {

    if (global.fn.loadmodalui(undefined, node)) {
        node.init();
    }
}

function _hide() {
    if (touch_timeout) {
        clearTimeout(touch_timeout);
        touch_timeout = null;
    }

    if (global.isValidNative(node)) {
        node.setVisible(false);
        effect_node.stop();
    }

    visible = false;
}

function _show(time, callback) {

    if (cur_scene == null) {

        node.show();

        cur_scene = cc.Director.getInstance().getRunningScene();
        if (cur_scene) {
            cur_scene.addChild(node);
        }

    }
    else {

        var run_scene = cc.Director.getInstance().getRunningScene();

        if (run_scene != cur_scene) {

            cur_scene = run_scene;

            node.show();
            if (cur_scene) {
                cur_scene.addChild(node);
            }
        }

    }

    // play effect
    effect_node.play();

    node.setVisible(true);
    visible = true;

    if (time > 0) {
        if (touch_timeout) {
            clearTimeout(touch_timeout);
            touch_timeout = null;
        }

        touch_timeout = setTimeout(function () {
            if (visible) {
                _hide();
            }

            if (callback) {
                callback();
            }
        }, time * 1000);
    }
}

exports.show_loading = function (show, time, callback) {
    if (visible) {
        _hide();
    }

    if (show) {
        _show(time, callback);
    }
}