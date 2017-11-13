
//common net ui 

var node = {};

var cur_scene = null;

var visible = false;

var ccbi_path = "./ui/wang_luo_chong_lian_ti_shi_kuang.ccbi";

var effect_node = null;

node.init = function () {

    //set larger order to show at the top
    this.setZOrder(cc.zorderBase * cc.layer_top);

    //catch touch event
    this.setTouchEnabled(true);

    //set node as a swallow one
    this.setTouchMode(1);

    //set node a higher priority
    this.setTouchPriority(cc.layer_top * cc.touchPriorityBase + cc.touchPriorityLayer);

    //for effect 
    if (global.data.tables.UIEffect) {

        var effectdes = global.data.tables.UIEffect;
        if (effectdes && typeof effectdes == "object") {
            //our effect_horse
            var tmp = effectdes["34"];

            //need fix -- just for test
            var eid = tmp ? tmp.EffectID : "ect_load";

            var effect_horse = global.res.scml(eid);

            //for effect
            if (!fs.exist(effect_horse)) {
                console.log("can not find loading effect : " + effect_horse);
            }
            else {
                
                effect_node = global.createEffect(eid, true);
                effect_node.stop();

                effect_node.setPosition(node.layer_action_horse.getPosition());
                node.addChild(effect_node);
            }
        }
    }

    //hide first
    _hide();
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

    if (effect_node) {
        effect_node.stop();
    }

    node.setVisible(false);

    visible = false;
}

function _show(str) {

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

    node.setVisible(true);

    //for effect
    if (effect_node) {
        effect_node.play();
    }

    visible = true;
}

node.show = function () {

    if (loadui(ccbi_path, node)) {
        node.init();
    }
}

//show ui
exports.show_netui = function () {

    if (!visible) {
        _show();
    }

}

//hide ui
exports.hide_netui = function () {

    if (visible) {
        _hide();
    }

}