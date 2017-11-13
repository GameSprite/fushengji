// rewrite some prototype
var netjs = require("../lib/net");

//extend global
global.isValidNative = __isValidNativeObject;

// extend node
// insert to spx
cc.Node.prototype.__play = function (spx_name, loop, sync) {
    this.__stop();

    var spx = global.createEffect(spx_name, loop, !loop, sync);
    var cid = spx.createCharacterMap();
    spx.pushCharacter(cid);
    spx.insertCharacterMap(cid, 0, 0, this);

    if (this.__status && this.__status.parent) {
        global.node.loadStatus(spx, this.__status);
    } else {
        console.log('I have no parent to add the spx.');
    }
    this.__spx = spx;
    return spx;
}

// remove from spx
cc.Node.prototype.__stop = function () {
    if (this.__spx) {
        cc.SpriterX.removeSpriterX(this.__spx);
        this.__spx = null;
    }
}

// hook stop action
cc.Node.prototype.__stopAction = cc.Node.prototype.stopAction;
cc.Node.prototype.stopAction = function (action) {
    if (global.isValidNative(action)) {
        this.__stopAction(action);
    }
}

// set shader by name, arg0, arg1..
cc.Node.prototype.setShader = function (name) {
    // check same shader
    if (this.__shader && this.__shader.name === name) {
        if (arguments.length > 1) {
            this.setShaderArgs.apply(this, arguments);
        }
        return;
    }

    var shader;
    if (name instanceof cc.GLProgram) {
        shader = name;
    } else {
        shader = global.shader_manager.getshader.apply(global.shader_manager, arguments);
    }
    if (shader) {
        this.__shader = shader.obj;
        
        var old_shader = this.getShader();
        this.setShaderProgram(shader);
        return old_shader;
    }
}

// get shader
cc.Node.prototype.getShader = function () {
    var shader = this.getShaderProgram();
    if (shader) {
        //  delay release, to let outer have time to retain
        shader.retain();
        setTimeout(function () {
            shader.release();
        }, 1);
    } else {
        // make null as normal
        shader = global.shader_manager.getshader('normal');
    }
    return shader;
}

// set shader args
cc.Node.prototype.setShaderArgs = function (name) {
    if (this.__shader && this.__shader.name === name && arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.__shader.setArgs(args);
    }
}

// is valid native object
cc.Node.prototype.isValidNative = function () {
    return global.isValidNative(this);
}

// safe remove from parent
cc.Node.prototype._removeFromParent = cc.Node.prototype.removeFromParent
cc.Node.prototype.removeFromParent = function () {
    if (this.isValidNative()) {
        this._removeFromParent();
    }
}

// random rotate
cc.Node.prototype.randomRotate = function () {
    this.setRotation(Math.random() * 360);
}

cc.Node.prototype.setColorEx = function (c) {
    var t = typeof c;
    if (t === 'object') {
        // obj
        this.setColor(c);
    } else if (t === 'string') {
        // #rrggbb
        this.setColor(global.convertColor(c));
    } else {
        // num
        var color_index = c > 999 ? Math.floor(c / 1000) : c;
        var d = global.jsondata.get('GameColor', color_index);
        this.setColor(cc.c3b(d.red, d.green, d.blue));
    }
}

cc.Node.prototype.setGray = function (flag) {
    global.ui_utils.visitNodeChildren(this, function (node) {
        if (node.setGray) {
            node.setGray(flag);
        }
    });
}

// used as stencil to clip other nodes, and add to parent
cc.Node.prototype.clipOn = function (node, parent) {
    var clip_node = global.ui_utils.clipWithNode(node, this);
    parent = parent || this.getParent();
    if (parent) {
        var pos = global.node.convertFromTo(this, parent);
        cc.p._sub(pos, this.getPosition());
        clip_node.setPosition(pos);
        parent.addChild(clip_node, this.getZOrder());
    } else {
        //console.log('no parent to clip on!');
    }
	return clip_node;
}

//extend the sprite
cc.Sprite.prototype.setGray = function (flag) {
    this.setShaderProgram(flag ? global.shader_manager.getshader("gray") : global.shader_manager.getshader("normal"));
}
//when the sprite display frame is changed, we need recreate the offset, so may be need hook the setDisplayFrame in future.
cc.Sprite.prototype.setBloom = function (flag, color, b_dynamic) {

    this.unscheduleUpdate();

    if (flag) {

        this.setColor(color);
        this.setBlendFunc(cc.gl.SRC_ALPHA, cc.gl.ONE_MINUS_SRC_ALPHA);

        b_dynamic = b_dynamic === undefined ? true : b_dynamic;

        //may the texture is changed
        var size = this.getTextureRect();

        if (b_dynamic) {

            var d_min = 0;
            var d_max = 4;
            var f_time = 3; //seconds
            //20 fps update
            var update_count = 3;

            var min_x = d_min / size.width;
            var max_x = d_max / size.width;
            var min_y = d_min / size.height;
            var max_y = d_max / size.height;

            var t_shader = global.shader_manager.getshader("bloom_d", min_x, min_y);
            this.setShaderProgram(t_shader);

            var total_time = 0;
            var half_time = f_time / 2;
            var u_count = 1;
            this.update = function (dt) {

                total_time += dt;

                //do update
                if (u_count == 1) {

                    var sx, sy;
                    if (total_time < half_time) {
                        var dt = total_time / half_time;
                        sx = (max_x - min_x) * dt + min_x;
                        sy = (max_y - min_y) * dt + min_y;
                    }
                    else if (total_time < f_time) {
                        var dt = (f_time - total_time) / half_time;
                        sx = (max_x - min_x) * dt + min_x;
                        sy = (max_y - min_y) * dt + min_y;
                    }
                    else {
                        total_time = 0;
                        sx = min_x;
                        sy = min_y;
                    }
                    t_shader.update(sx, sy);
                }

                u_count++;
                if (u_count > update_count) {
                    u_count = 1;
                }
            }

            this.onEnter = function () {
                this.scheduleUpdate();
            }

        }
        else {
            var delta = 4;

            this.setShaderProgram(global.shader_manager.getshader("bloom", delta / size.width, delta / size.height));
        }
    }
    else {
        this.setShaderProgram(global.shader_manager.getshader("normal"));
    }
}

// set blur
cc.Sprite.prototype.setBlur = function (blur_size) {
    blur_size = blur_size || 0.9;
    var content_size = this.getTexture().getContentSizeInPixels();
    this.setShader('Blur', 'blurSize;' + blur_size / content_size.width + ';' + blur_size / content_size.height);
}

cc.Sprite.prototype.setImage = function (file) {
    var sf = global.ui_utils.createSpriteFrame(file);
    if (sf) {
        this.setDisplayFrame(sf);
    }
}

//extend the scale9sprite
cc.Scale9Sprite.prototype.setDisplayFrame = function (frame) {
    if(global.isNull(frame))
    {
        return;
    }
    var size = this.getPreferredSize();

    var batchnode = cc.SpriteBatchNode.createWithTexture(frame.getTexture(), 9);
    this.updateWithBatchNode(batchnode, frame.getRect(), frame.isRotated(), this.getCapInsets());

    this.setPreferredSize(size);
}

cc.Scale9Sprite.prototype.setGray = function (flag) {

    var children = this.getChildren();
    var batchnode = children[0];

    batchnode.setShaderProgram(flag ? global.shader_manager.getshader("gray") : global.shader_manager.getshader("normal"));
}

//extend the CCMenuItemSprite
cc.MenuItemSprite.prototype.initshader = function () {
    var normal = this.getNormalImage();

    var selected = cc.Sprite.createWithSpriteFrame(normal.displayFrame());
    selected.setColor(cc.c3b(50, 50, 50));
    selected.setShaderProgram(global.shader_manager.getshader("brightness"));

    var disabled = cc.Sprite.createWithSpriteFrame(normal.displayFrame());
    disabled.setShaderProgram(global.shader_manager.getshader("gray"));

    this.setSelectedImage(selected);
    this.setDisabledImage(disabled);
}

cc.MenuItemSprite.prototype.setMultiTouch = function (node, dt) {
    var param = {};
    param.menu = this.getParent();
    param.menu.node = node;
    param.dt = dt;
    return global.ui_utils.createMenu('mult', param);
}

cc.MenuItemSprite.prototype.setLongTouch = function (node, dt) {
    var param = {};
    param.menu = this.getParent();
    param.menu.node = node;
    param.dt = dt;
    return global.ui_utils.createMenu('long', param);
}

cc.MenuItem.prototype.changeCallback = function (funcName, owner) {
    cc.BuilderReader.setCallback(this, funcName, owner);
}

cc.MenuItemSprite.prototype.setTouchEffect = function () {
    global.ui_utils.setMenuTouchEffect(this.getParent());
}

cc.Menu.prototype.setTouchEffect = function () {
    global.ui_utils.setMenuTouchEffect(this);
}

//hook the LabelTTF,to support strenter auto
cc.LabelTTF.prototype._setString = cc.LabelTTF.prototype.setString;
cc.LabelTTF.prototype.setString = function (str, len) {
    if (!this.isValidNative()) {
        console.log('LabelTTF setString error: invalid native obj.');
        return;
    }

    if (!str) {
        str += '';
    }

    if (len >= 1000) {
        var color_index = Math.floor(len / 1000);
        var d = global.jsondata.get('GameColor', color_index);
        this.setColor(cc.c3b(d.red, d.green, d.blue));
        len -= color_index * 1000;
    }

    //use tag for strenter , we should not use tag for other purpose
    var tag_len = len || this.getTag();

    if (tag_len > 0) {
        str = global.fn.strenter(str, tag_len);
    }

    this._setString(str);
}

//hook SpriterX.insertCharacterMap
cc.SpriterX.prototype._insertCharacterMap = cc.SpriterX.prototype.insertCharacterMap;
cc.SpriterX.prototype.insertCharacterMap = function (id, folder, file, obj) {
    if (obj) {
        obj._inserted = true;
        global.node.saveStatus(obj);

        if (!this.objs) {
            this.objs = [];
        }
        this.objs.push(obj);
    }
    this._insertCharacterMap.apply(this, arguments);
}

cc.SpriterX.removeSpriterX = function (spx) {
    if (spx) {
        if (spx.objs) {
            spx.objs.forEach(function (obj) {
                if (obj._inserted) {
                    obj.retain();
                }
            });
        }

        if (spx.isValidNative()) {
            cc.Node.prototype.removeFromParent.call(spx);
        }

        if (spx.objs) {
            spx.objs.forEach(function (obj) {
                if (obj._inserted) {
                    obj._inserted = false;
                    global.node.loadStatus(obj);
                    obj.release();
                }
            });
            delete spx.objs;
        }
    }
}

cc.SpriterX.prototype.removeFromParent = function () {
    cc.SpriterX.removeSpriterX(this);
}

//extend cc.TMXTiledMap
cc.TMXTiledMap.prototype.toTile = function (pos) {
    var tile_size = this.getTileSize();
    var map_size = this.getMapSize();
    return cc.p(Math.floor(pos.x / tile_size.width),
        map_size.height - 1 - Math.floor(pos.y / tile_size.height));
}

cc.TMXTiledMap.prototype.hasTileAt = function (pos, name) {
    if (arguments.length == 1) {
        var layers = this.getChildren();
        if (layers) {
            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].getTileAt(this.toTile(pos))) {
                    return true;
                }
            }
        }
    } else if (arguments.length == 2) {
        var layer = this.getLayer(name);
        if (layer) {
            return layer.getTileAt(this.toTile(pos));
        }
    }
    return false;
}

// extend connection
var _conn = netjs.create('', 1);
var connection = _conn.constructor;

connection.TIMEOUT_LOADING = 2000;
connection.AUTO_RECONN_TIMES = 3;
connection.TIMEOUT_HIDE = 5000;

connection.prototype.__send = connection.prototype.send;
connection.prototype._send = function (msg) {
    // if heartbeat, not show loading
    if (typeof msg !== 'object' || msg._id !== '_hb') {
        // set timeout to show loading
        if (this._timeout_load) {
            clearTimeout(this._timeout_load);
        }
        var self = this;
        this._timeout_load = setTimeout(function () {
            global.show_loading(true);

            // set timeout to hide loading
            if (self._timeout_hide) {
                clearTimeout(self._timeout_hide);
            }
            self._timeout_hide = setTimeout(function () {

                global.show_loading(false);

                //check net is closed
                if (os.netstate() == os.NET_NONE) {

                    self.__close();
                    self.reconning = false;
                    self._timeout_hide = null;
                    self._timeout_load = null;
                    self.reconn_times = connection.AUTO_RECONN_TIMES;
                    self.args = [];
                    global.events.emit("disconnect");

                    global.show_dialog1(global.str.net_disconnect, function () {
                        self.reconn();
                    },true);
                }

            }, connection.TIMEOUT_HIDE);

        }, connection.TIMEOUT_LOADING);
    }

    return connection.prototype.__send.apply(this, arguments);
}

// when recv data, hide loading
connection.prototype.onCommon = function () {
    if (this._timeout_load) {
        clearTimeout(this._timeout_load);
        this._timeout_load = null;
    }
    global.show_loading(false);

    if (this._timeout_hide) {
        clearTimeout(this._timeout_hide);
        this._timeout_hide = null;
    }

    this.not_reconn = false;
}

connection.prototype.send = function () {
    if (this.keepalived) {
        // if disconnected
        if (!this.socket) {
            // save args
            this.args = this.args || [];
            this.args.push(Array.prototype.slice.call(arguments));

            // re conn
            this.reconn();
        } else {
            return connection.prototype._send.apply(this, arguments);
        }
    } else {
        return connection.prototype._send.apply(this, arguments);
    }
}

connection.prototype.onReconn = function () {
    this.reconning = false;
    global.show_loading(false);
    
    if (this.args) {
        for (var i = 0; i < this.args.length; ++i) {
            connection.prototype._send.apply(this, this.args[i]);
        }
        this.args.length = 0;
    }
}

connection.prototype.onClose = function () {
    var reconning = this.reconning;
    this.reconning = false;
    global.show_loading(false);

    if (reconning) {
        this.onReconnFailed();
    } else {
        this.reconn_times = 0;
    }

    if (this._timeout_hide) {
        clearTimeout(this._timeout_hide);
        this._timeout_hide = null;
    }
}

connection.prototype.reconn = function () {
    if (this.not_reconn) {
        return;
    }

    this.reconning = true;
    global.show_loading(true);

    this.__close();
    this.start();
}

connection.prototype.onReconnFailed = function () {
    if (this.not_reconn) {
        return;
    }

    ++this.reconn_times;
    console.log('recon failed: ', this.reconn_times);
    if (this.reconn_times >= connection.AUTO_RECONN_TIMES) {
        // show net ui
        var that = this;
        global.show_dialog1(global.str.net_disconnect, function () {            
            that.reconn();
        },true);
    } else {
        // re conn
        this.reconn();
    }
}

connection.prototype.__close = connection.prototype.close;
connection.prototype.close = function () {
    this.not_reconn = true;
    this.__close();
}