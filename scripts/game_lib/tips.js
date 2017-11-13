
//common tips 

var node = {};

var cur_scene = null;
var origin_pos;

global.events.on('logout', function () {
    node.clean();
});

node.init = function () {
    origin_pos = node.ttf_ziti.getPosition();

    // create a holder
    var holder = cc.Node.create();
    this.addChild(holder)
    holder.setPosition(origin_pos);
    this.holder = holder;

    var members = ['ditu', 'ttf_ziti'];
    members.forEach(function (name) {
        var child = node[name];
        child.retain();
        child.removeFromParent();
        child.setPosition(cc.POINT_ZERO);
        holder.addChild(child);
        child.release();
    });

    //show at common layer
    this.setZOrder(cc.zorderBase * cc.layer_common);
}

node.clean = function () {
    cur_scene = null;
    delete this._layerlv;
}

node.show = function () {

    if (global.fn.loadui(global.res.ccbi(global.res.tips), node)) {
        node.init();
    }
}

exports.show_tips = function (str, pos, t, fnc) {
    if (t == undefined || t == null){
        t = 1.1;
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

    if (typeof str === 'number') {
        str = global.fn.getConfigString ? global.fn.getConfigString(str) : str;
    }
    if (pos == undefined) {
        pos = origin_pos;
    }

    node.ttf_ziti.setString(str);

    node.stopAllActions();
    node.holder.stopAllActions();
    node.holder.setPosition(pos);
    node.setVisible(true);

    if(fnc == undefined)
    {
        fnc = function(){};
    }
    node.runAction(cc.Sequence.create(cc.DelayTime.create(t), cc.Hide.create(),cc.CallFunc.create(fnc)));
    node.holder.runAction(cc.MoveBy.create(0.6, cc.p(0, 50)));
}
