
//common dialog

require('./ui_utils');
var RichLabalController = require("../game/game_main/ui_controller/rich_labal_controller").RichLabalController;
var node = {};

var cur_scene = null;

var queding_fn = null;
var quxiao_fn = null;
var ok_fn = null;

var visible = false;
var init_flag = false;

var ccbi_path = "ui_common_tanchu1.ccbi";

node.resetFields = function () {
    this.menu_btn = this.menu_anniu;
    this.qu_xiao_btn = this.btn_quxiao;
    this.que_ding_btn = this.btn_queding;
    this.que_ding_2_btn = this.btn_queding1;
}

node.createLabel = function () {
    this.text = global.ui_utils.createMemoLabel(this.label_wenzi);
    this.text.setAlign(0);
}

node.init = function () {
    // reset fields
    this.resetFields();

    //show at common layer
    this.setZOrder(cc.zorderBase * cc.layer_common);

    //catch touch event
    this.setTouchEnabled(true);

    //set node as a swallow one
    this.setTouchMode(1);

    //set node a higher priority
    this.setTouchPriority(cc.layer_common * cc.touchPriorityBase + cc.touchPriorityLayer);

    //set menu a more higher priority
    this.menu_btn.setTouchPriority(cc.layer_common * cc.touchPriorityBase + cc.touchPriorityMenu);

    //hide first
    _hide();

    //create label
    //this.createLabel();
    if(global.data){
        node.spr_queding.setString(global.data.tables["Dictionary"]["99033"].string);
        node.spr_queding1.setString(global.data.tables["Dictionary"]["99033"].string);
        node.spr_quxiao.setString(global.data.tables["Dictionary"]["50664"].string);
    }

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

// need a layer not node
function loadui(ccbi, ower) {
    //set ccbi resource path
    var path = ccbi.slice(0, ccbi.lastIndexOf("/") + 1);

    cc.BuilderReader.setResourcePath(path);

    var obj = new cc.Layer();

    ower.__proto__ = obj;
    //make js obj bind to native obj.
    __associateObjWithNative(ower, obj);

    //load ccbi
    var node = cc.BuilderReader.load(ccbi, ower);

    if (node) {
        console.log("load ccbi : " + ccbi + " ok !");

        ower.addChild(node);

        // adapt screen
        global.screen_adapter.adaptUI(ower);

        return true;
    }

    return false;
}

function _hide() {

    if (__isValidNativeObject(node)) {
        node.setVisible(false);
        node.menu_btn.setVisible(false);        //disable touch event
        node.qu_xiao_btn.setVisible(false);
        node.que_ding_btn.setVisible(false);
        node.que_ding_2_btn.setVisible(false);
        node.spr_quxiao.setVisible(false);
        node.spr_queding.setVisible(false);
        node.spr_queding1.setVisible(false);
    }

    queding_fn = null;
    quxiao_fn = null;
    ok_fn = null;

    visible = false;
}

function _show(str , isTopLayer) {

    if (!init_flag && !global.game_updating) {

        global.events.on('logout', function () {
            node.clean();
        });

        init_flag = true;
    }

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
    // set zorder
    node.setZOrderLayer(isTopLayer);

    // set string
    node._setString(str);

    node.setVisible(true);
    node.menu_btn.setVisible(true);

    visible = true;
}

node.setZOrderLayer = function (isTopLayer) {
    var nZorder = cc.layer_common;
    if(isTopLayer){
        nZorder = cc.layer_guide + 1;
    }
    //show at common layer
    this.setZOrder(cc.zorderBase * nZorder);

    //set node a higher priority
    this.setTouchPriority(nZorder * cc.touchPriorityBase + cc.touchPriorityLayer);

    //set menu a more higher priority
    this.menu_btn.setTouchPriority(nZorder * cc.touchPriorityBase + cc.touchPriorityMenu);
}

node._setString = function (str) {
    //this.text.setString(str);
    if(str == undefined)
    {
        return;
    }
    var ref_label = this["label_wenzi"];

    var ttf = RichLabalController.create(ref_label, str, ref_label.getFontSize());
    ttf._richNode.setAnchorPoint(ref_label.getAnchorPoint());
    ttf._richNode.setPosition(ref_label.getPosition());
}

node.show = function () {
    var ccbi_pach = "./ui/" + global.Language.current +"_" + ccbi_path;
    if (loadui(ccbi_pach, node)) {
        node.init();
    }
}

node.press_btn_quxiao = function () {
    if (!global.game_updating)
    {
        var sound_name = global.jsondata.get('AudioMain', "ui_common_tanchu1").btn_quxiao;
        global.fn.play_button_sound(sound_name);
    }

    if (typeof quxiao_fn === "function") {
        quxiao_fn();
    }
    global.isCanTouch_circle = false;
    _hide();
}

node.press_btn_queding = function () {
    if (!global.game_updating)
    {
        var sound_name = global.jsondata.get('AudioMain', "ui_common_tanchu1").btn_queding;
        global.fn.play_button_sound(sound_name);
    }

    if (typeof queding_fn === "function") {
        queding_fn();
    }
    _hide();
}

node.press_btn_queding1 = function () {
    if (!global.game_updating)
    {
        var sound_name = global.jsondata.get('AudioMain', "ui_common_tanchu1").btn_queding1;
        global.fn.play_button_sound(sound_name);
    }

    if (typeof ok_fn === "function") {
        ok_fn();
    }
    _hide();
}

//dialog contains a ok button
exports.show_dialog1 = function (str, cb , isTopLayer) {

    if (visible) {
        _hide();
    }

    _show(str , isTopLayer);

    ok_fn = cb;

    node.que_ding_2_btn.setVisible(true);
    node.spr_queding1.setVisible(true);
}

//dialog contains ok and cancel button
exports.show_dialog2 = function (str, qd_cb, qx_cb , isTopLayer) {

    if (visible) {
        _hide();
    }

    _show(str , isTopLayer);

    queding_fn = qd_cb;
    quxiao_fn = qx_cb;

    node.qu_xiao_btn.setVisible(true);
    node.que_ding_btn.setVisible(true);
    node.spr_quxiao.setVisible(true);
    node.spr_queding.setVisible(true);
}
//dialog with only str,no buttons,shown for exiting app
exports.show_dialog3 = function(str) {
    if (visible) {
        _hide();
    }

    _show(str, true);
    node.qu_xiao_btn.setVisible(false);
    node.que_ding_btn.setVisible(false);
    node.spr_quxiao.setVisible(false);
    node.spr_queding.setVisible(false);
}

//sometimes we need close dialog when timeout
exports.hide_dialog = function () {

    if (visible) {
        _hide();
    }

}