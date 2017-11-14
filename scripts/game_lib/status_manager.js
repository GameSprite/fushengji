//------ manager all nodes ------//
var debug_ui = require("./debug_ui");

//------------ ui_node begin ---------//
function ui_node(node,ui_name) {

    //store ccbi name
    var show_fn = node.show.toString();

    var name_str = show_fn.replace(/[\s\S]*global.res.ccbi\((.*?)\)[\s\S]*/g, "$1");

    //check replace ok,just use length
    if (name_str.length < show_fn.length) {
        node.ccbi_name = eval(name_str);

        if (ui_manager.ccbi_js[node.ccbi_name] === undefined) {
            ui_manager.ccbi_js[node.ccbi_name] = [];
        }
        global.array.add(ui_manager.ccbi_js[node.ccbi_name], ui_name);
    }
    else {
        node.ccbi_name = "";
    }

    node.js_name = ui_name;

    this.node = node;
    
    this.init_flag = false;

    this.control_flag = false;

    this.used = 0;

    //for multiply resolution  
    this.original_scale_x = 1;
    this.original_scale_y = 1;
}

ui_node.prototype.init = function () {

    if (!this.init_flag) {        
        // TEST: overwrite node.update_data
        if (!this.node.__update_data && this.node.update_data) {
            this.node.__update_data = this.node.update_data;
            var that = this;
            this.node.update_data = function () {
                console.log('update data: ', that.node.js_name);
                return this.__update_data.apply(this, arguments);
            }
        }
        
        //the show function must be implement
        this.node.show();
        this.init_flag = true;

        global.events.emit("node_init", this.node);
    }
}

ui_node.prototype.clean = function () {

    if (this.init_flag) {
        // if enter, then exit
        if (this.node.isEnter()) {
            this.node.setEnter(false);

            //call exit
            if (typeof this.node.exit === "function") {
                this.node.exit();
            }

            global.events.emit("node_exit", this.node);
        }

        if (typeof this.node.clean === 'function') {
            this.node.clean();
        }

        this.node.removeFromParent();
        this.init_flag = false;

        // reset some flag
        delete this.node._layerlv;
        delete this.node._belownode;
    }
}

ui_node.prototype.isinit = function () {
    return this.init_flag;
}

//get the node
ui_node.prototype.getnode = function(){
    if (this.init_flag) {
        return this.node;
    }

    return null;
}

//register the node to main scene
ui_node.prototype.register = function (mainScene) {

    //check is control by others before
    if (this.control_flag) {
        
        //delete cleanup first
        delete this.node.onCleanup;
        this.node.setEnter(false);

        this.node.removeFromParent();
        mainScene.addChild(this.node);
        this.node.release();

        this.control_flag = false;

        //for multiply resolution 
        this.node.setScaleX(this.original_scale_x);
        this.node.setScaleY(this.original_scale_y);
    }
    else
    {
        if (!this.init_flag) {
            
            //init first
            this.init();
            mainScene.addChild(this.node);
        }
    }
}

//control the node by others
ui_node.prototype.control = function (not_control) {

    //check is already control
    if (!this.control_flag) {
        
        //init first
        this.init();

        //we need store the node
        this.node.retain();

        this.control_flag = true;

        // mark enter
        this.node.setEnter(true);

        var that = this;
        this.node.onCleanup = function () {
            that.uncontrol();
        }

        //for multiply resolution  
        this.original_scale_x = this.node.getScaleX();
        this.original_scale_y = this.node.getScaleY();

        if (!not_control) {
            this.node.setScaleX(1);
            this.node.setScaleY(1);
        }
    }
}

//not control
ui_node.prototype.uncontrol = function () {
    if (this.control_flag) {

        this.init_flag = false;

        this.control_flag = false;

        // mark enter
        this.node.setEnter(false);

        // release
        this.node.release();
    }
}

//------------ ui_node end ---------//



//------------ ui_manager begin ---------//

function ui_manager(main_scene) {

    this.nodes = {};

    this.main_scene = main_scene;
    this.first_flag = false;
    main_scene.retain();                    //retain main scene

    this.current_name = "";
    this.last_name = "";

    this.cur_layerlv = cc.layer_bottom;

    //store touch count
    this.cur_touchcount = 0;

    this.max_mem = ui_manager.max_mem;
}

ui_manager.visible_point = global.screen_adapter.center_offset;
ui_manager.invisible_point = cc.p(50000, 50000);
//reserve some space for other use
ui_manager.layerlv_step = 3;
//max_num to open debug mode
ui_manager.debug_opennum = 50;
//for ccbi name to js
ui_manager.ccbi_js = {};

ui_manager.prototype.registerStatus = function (node, ui_name) {

    //remove first
    this.removeStatus(ui_name);

    this.nodes[ui_name] = new ui_node(node, ui_name);

    node.isEnter = cc.Node.prototype.isEnter;
}

ui_manager.prototype.removeStatus = function (ui_name) {

    var obj = this.nodes[ui_name];

    if (obj) {

        obj.clean();

        delete this.nodes[ui_name];
    }
}

ui_manager.prototype.getNodeHolder = function () {
    if (!this.node_holder) {
        var node = cc.Node.create();
        node.retain();

        this.node_holder = node;
    }
    return this.node_holder;
}

ui_manager.prototype.enterNode = function (node) {
    this.resumeNode(node);
}

ui_manager.prototype.exitNode = function (node) {
    this.pauseNode(node);    
}

ui_manager.prototype.pauseNode = function (node) {
    node.doExit();
}

ui_manager.prototype.resumeNode = function (node) {
    if (!node.isRunning()) {
        node.doEnter();
    }
}

//------------------------ when enter game, we need release res before ------------------------//

// change status
// ui_name
// not_pause or param
// update params
ui_manager.prototype.changeStatus = function (ui_name, not_pause) {

    console.log("changeStatus : " + ui_name);
    console.log("changeStatus : not_pause=%j", not_pause);      
    // check update status
    var update_func;
    if (arguments.length > 2) {
        var that = this;
        var the_args = arguments;
        update_func = function () {
            var args = [ui_name];
            args = args.concat(Array.prototype.slice.call(the_args, 2));
            that.updateStatus.apply(that, args);
        }
    }

    //check change to self
    if (ui_name == this.current_name) {

        console.log("changeStatus from self to self : " + ui_name);

        this.cur_touchcount++;

        if (this.cur_touchcount > ui_manager.debug_opennum) {
            debug_ui.open();
        }

        if (update_func) {
            update_func();
        }
        
        return;
    }
    else {
        this.cur_touchcount = 0;
    }

    var obj = this.nodes[ui_name];
    
    if (obj) {
        ++obj.used;

        if (!this.first_flag) {

            //delay scene replace when first ui to show
            //need check, launch may use scene
            var director = cc.Director.getInstance();
            if (director.getRunningScene()) {

                
                //replace a dummy scene to release the launch cache( texture files ),when next time
                director.replaceScene(cc.Scene.create());

                var main_scene = this.main_scene;
                global.nextTick(function () {

                    //release cache resources
                    cc.SpriteFrameCache.getInstance().removeUnusedSpriteFrames();
                    cc.TextureCache.getInstance().removeUnusedTextures();

                    director.replaceScene(main_scene);

                });
            }
            else {
                director.runWithScene(this.main_scene);
            }

            this.first_flag = true;
        }        

        //check max mem
		var _tmp_mem = os.selfmem();
        if (_tmp_mem >= this.max_mem) {
        
            // clean ui except ui_name
            this.clean(ui_name);
			
			global.logserver("max_mem : " + this.max_mem + " clean before : " + _tmp_mem.toFixed(2) + " clean after : " + os.selfmem().toFixed(2));
        }

        //register first
        obj.register(this.main_scene);

        var node = obj.getnode();

        //check is the first node to show
        if (!this.nodes[this.current_name]) {

            this.current_name = ui_name;

            node.setEnter(true);

            node.setVisible(true);
            node.setPosition(ui_manager.visible_point);

            //if not running,call on enter
            this.enterNode(node);
            
            if (typeof node.enter === "function") {
                node.enter();
            }

            global.events.emit("node_enter",node);

            if (update_func) {
                update_func();
            }

            global.events.emit("status_change", node, ui_name);
            return;
        }
        
        var current = this.nodes[this.current_name].getnode();

        //store the node need call enter
        var enter_node = node;
        
        //maybe the node is enter yet
        if (node.isEnter() || !node.isModal()) {

            //just hide all node above it if visible
            //otherwise if not a modal, hide all nodes
            var below = current;
            while (below) {

                if (below != node) {

                    below.setEnter(false);

                    below.setVisible(false);
                    below.setPosition(ui_manager.invisible_point);

                    this.exitNode(below);

                    //call exit
                    if (typeof below.exit === "function") {
                        below.exit();
                    }

                    global.events.emit("node_exit", below);

                    //do not reset layer level at here, just store it for refresh

                    var tmp_node = below.getBelow();
                    below.setBelow(null);
                    below = tmp_node;

                    //sub layer when have below
                    if (below) {
                        this.cur_layerlv -= ui_manager.layerlv_step;
                    }
                }
                else {
                    // show
                    node.setVisible(true);

                    //if not running,call on enter
                    this.enterNode(node);

                    //not need call enter
                    enter_node = null;

                    // hide below
                    this.hideBelowStatus(node);

                    // show mask layer
                    this.showMaskLayer(node, node.getLayerLv());

                    break;
                }
            }
        } else {
            if (!not_pause) {
                // current pause
                this.pauseNode(current);
            }
        }
        
        //node is not visible (if visible must be found)
        if (enter_node) {

            if (node.isModal()) {

                //set below node
                node.setBelow(current);

                this.cur_layerlv += ui_manager.layerlv_step;
                node.setLayerLv(this.cur_layerlv);
            }
            else {
                node.setLayerLv(cc.layer_bottom);
            }
        }

        this.last_name = this.current_name;
        this.current_name = ui_name;
        
        //call enter
        if (enter_node) {

            enter_node.setEnter(true);

            enter_node.setVisible(true);
            enter_node.setPosition(ui_manager.visible_point);

            //if not running,call on enter
            this.enterNode(enter_node);

            if (typeof enter_node.enter === "function") {

                enter_node.enter();

            }

            //we need refresh node when enter
            //notice : cocos2d-x has a bug when reset priority in touch handler (changeStatus may be cause by touch handler)
            //we fix it,so not use timeout now
            enter_node.refresh();

            global.events.emit("node_enter", enter_node);

            // hide below
            this.hideBelowStatus(enter_node);

            // show mask layer
            this.showMaskLayer(enter_node, enter_node.getLayerLv());
        }

        if (update_func) {
            update_func();
        }

        global.events.emit("status_change", node, ui_name);
    }
    else {
        console.log("status : %s is not exist !", ui_name);
    }    
}

// hide below status
ui_manager.prototype.hideBelowStatus = function (node) {
    if (node && node.isModal()) {
        var hide_below = node.hide_below;
        var below = node.getBelow();
        while (below) {
            if (below.isModal()) {
                below.setVisible(!hide_below);
            }
            if (!hide_below && below.hide_below) {
                hide_below = true;
            }

            below = below.getBelow();
        }
    }
}

// get status node
// Note: it's only used for the logic, not for the ui
ui_manager.prototype.getStatusNode = function (ui_name) {
    var obj = this.nodes[ui_name];
    if (obj) {
        return obj.node;
    }
}

ui_manager.prototype.getStatus = function (ui_name, not_control) {

    var obj = this.nodes[ui_name];

    if (obj) {

        //check is control by others
        if (!obj.isinit()) {
            obj.control(not_control == undefined ? false : not_control);
        }

        return obj.getnode();
    }
}

ui_manager.prototype.isStatusInit = function (ui_name) {
    var obj = this.nodes[ui_name];

    if (obj) {

        return obj.isinit();
    }

    return false;
}

ui_manager.prototype.ungetStatus = function (ui_name) {
    var obj = this.nodes[ui_name];

    if (obj) {
        console.log('unget status:', ui_name);

        //check is control by others
        obj.uncontrol();
    }
}

//return str or arr (maybe multi ui use the same ccbi)
ui_manager.prototype.ccbiToJs = function (ccbi_name) {

    var arr = ui_manager.ccbi_js[ccbi_name];
    if (arr === undefined) {
        return "";
    }
    else
    {
        if (arr.length === 1) {
            return arr[0];
        }
        else
        {
            return arr;
        }
    }
}

ui_manager.prototype.checkCCBI = function () {
    for(var key in ui_manager.ccbi_js){
        var arr = ui_manager.ccbi_js[key];
        if (arr.length > 1) {
            console.log("found js %j use the same ccbi : %j" , arr , key);
        }
    }
}

// update status
// Note: if update_func_name is a function name of the status node, 
//          then call the function instead of update_data
ui_manager.prototype.updateStatus = function (ui_name, update_func_name) {

   var obj = this.nodes[ui_name];
    
    if (obj) {

        var node = obj.getnode();
        if (node) {
            // check update func name
            var arg_start = 1;
            var func_name;
            if (typeof update_func_name === 'string' && typeof node[update_func_name] === 'function') {
                func_name = update_func_name;
                arg_start = 2;
            } else {
                func_name = 'update_data';
            }
            
            if (typeof node[func_name] === "function") {
                node[func_name].apply(node, Array.prototype.slice.call(arguments, arg_start));
            }
        }
        else {
            // it's legal to be here
            //console.log("call updateStatus : %s before changeStatus , update_data will not be call !!!", ui_name);
        }
    }
    else {
        console.log("ui : %s is not exist !", ui_name);
    }
}

ui_manager.prototype.curStatusName = function () {
    return this.current_name;
}

ui_manager.prototype.lastStatusName = function () {
    return this.last_name;
}

ui_manager.prototype.curStatus = function () {

    var obj = this.nodes[this.current_name];
    return obj ? obj.getnode() : null;
}

ui_manager.prototype.toLastStatus = function () {

    if (this.last_name.length > 0) {

        this.changeStatus(this.last_name);

    }
    else {
        console.log("lastStatus is null !");
    }
}

ui_manager.prototype.toBelowStatus = function (node) {
    if (node === undefined) {
        node = this.getStatusNode(this.current_name);
    }

    var below = node.getBelow();
    if (below) {
        this.changeStatus(below.js_name);
    } else {
        console.log('no below for node:', node.js_name);
    }
}

// clean
ui_manager.prototype.clean = function (except) {

    // get all active node names
    //var actives = this._getActiveNodeNames();
    
    // get free nodes
    var total = 0;
    var free_nodes = [];
    for (var name in this.nodes) {
        var ui_node = this.nodes[name];
        // if inited, but not entered or in white list, store to clean
        // Note: not control means it's added to active nodes by getStatus
        if (ui_node.isinit() && !ui_node.node.isEnter() && ui_manager.white_list.indexOf(name) == -1
            && (!except || except != name)) {
            free_nodes.push(ui_node);
        }
        ++total;
    }
//     // sort by used
//     free_nodes.sort(function (a, b) {
//         return a.used - b.used;
//     });

    // get release num by level
    var release_num = free_nodes.length;
    console.log('ui clean: total = ' + total + ', cached = ' + free_nodes.length + ', release = ' + release_num);

    // do clean
    while (free_nodes.length > 0 && release_num-- > 0) {

        var ui_node = free_nodes.shift();
        ui_node.clean();
        
        console.log('remove node : ' + ui_node.node.js_name);
    }

    // release cache resources
    cc.SpriteFrameCache.getInstance().removeUnusedSpriteFrames();
    cc.TextureCache.getInstance().removeUnusedTextures();
	cc.removeUnusedAnimation();
}

//  real get active node names
ui_manager.prototype._getActiveNodeNames = function () {
    var actives = [];
    var current = this.nodes[this.current_name];
    if (current) {
        current = current.getnode();
        actives.push(current.js_name);
        // if modal, push all belows
        if (current.isModal()) {
            var below = current.getBelow();
            while (below) {
                actives.push(below.js_name);
                below = below.getBelow();
            }
        }
    }
    return actives;
}

// set max mem
ui_manager.prototype.setMaxMem = function (mem) {
    if (mem === undefined) {
        mem = ui_manager.max_mem;
    }
    this.max_mem = mem;
}

// reset
ui_manager.prototype.reset = function () {
    // remove all status
    for (var name in this.nodes) {
        this.removeStatus(name);
    }

    // clear scene
    this.main_scene.removeAllChildren();

    delete this.mask_layer;

    // clear var
    this.current_name = "";
    this.last_name = "";

    this.cur_layerlv = cc.layer_bottom;

    // set scene frame
    if (global.screen_adapter.need_frame) {
        var frame = cc.Sprite.create(global.res.jpg('res_background'));
        global.screen_adapter.setSceneFrame(this.main_scene, frame);
    }
}

// show mask layer显示遮罩层
ui_manager.prototype.showMaskLayer = function (enter_node, lv) {
    var show = enter_node.isModal();
    var mask_layer = this.getMaskLayer();
    if (mask_layer) {
        mask_layer.setVisible(show);
        if (show) {
            // Note: now just put the mask layer between 2 lv layers.
            lv -= 0.5;
            if(enter_node.getZOrder() <= cc.zorderBase){//model zorder is zero , reset zorder
                if(enter_node.getZOrder() == 0)enter_node.setZOrder(enter_node.getLayerLv());
                mask_layer.setZOrder(lv/** cc.zorderBase*/);
            }else{
                mask_layer.setZOrder(lv* cc.zorderBase);
            }
        }
    }
}

// lazy get mask layer
ui_manager.prototype.getMaskLayer = function () {
    var layer = this.mask_layer;
    if (!layer) {
        // add mask layer
        var win_size = global.screen_adapter.screen_size;
        var layer = cc.LayerColor.create(cc.c4b(0, 0, 0, 255 * 0.60), win_size.width, win_size.height);
        layer.setVisible(false);
        this.main_scene.addChild(layer);

        this.mask_layer = layer;
    }

    return layer;
}

//------------ ui_manager end ---------//


//create scene
function create_scene() {
    var director = cc.Director.getInstance();
    director.setDisplayStats(global.debug == 1);
    director.setAnimationInterval(1.0 / 60);
    var mainScene = cc.Scene.create();
    return mainScene;
}
exports.StatusManager = new ui_manager(create_scene());