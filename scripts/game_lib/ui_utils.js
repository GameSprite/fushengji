// ui utils
var ui_utils = {
    bind_nodes: {}
};
global.ui_utils = ui_utils;

var game_utils = require('./game_utils');

//对节点第一层子节点进行循环访问
//visit_func: 可以是回调函数处理child参数，也可是字符串 表示child的一个方法
//args: visit_func为方法名时可传递参数组
ui_utils.visitNodeChildren = function (node, visit_func, args) {
    if (!visit_func) {
        console.log('visit func is undefined.');
        return;
    }

    var visit = function (child) {
        if (typeof visit_func == 'function') {
            visit_func(child);
        } else if (typeof visit_func == 'string') {
            var the_visit = child[visit_func];
            if (the_visit && (typeof the_visit == 'function')) {
                args = args || [];
                the_visit.apply(child, args);
            }
        }
    }

    var children = node.getChildren();
    children.forEach(function (child) {
        visit(child);
    });
}

// 前序遍历所有子节点
ui_utils.visitNode = function (node, visit, depth) {
    depth = depth || 0;

    var stop_cur_node;
    if (visit) {
        stop_cur_node = visit(node, depth);
    }

    if (!stop_cur_node) {
        ++depth;

        var children = node.getChildren();
        for (var i = 0; i < children.length; ++i) {
            ui_utils.visitNode(children[i], visit, depth);
        }
    }
}

ui_utils.createSpriteFrame = function (file) {
    if (file.indexOf('/') === -1) {
        file = global.res.png(file);
    }
    var tex = cc.TextureCache.getInstance().addImage(file);
    if (!tex) {
        console.log('create sprite frame failed: ', file);
        return null;
    }
    return cc.SpriteFrame.createWithTexture(tex, cc.rect(0, 0, tex.getContentSize().width, tex.getContentSize().height));
}
// clip Label
// size: size for Label size
ui_utils.clipLabel = function (label , pngFile , inverted) {
    label.setVisible(false);
    var node = cc.LabelTTF.create(label.getString(),label.getFontName(),label.getFontSize());
    node.setAnchorPoint(label.getAnchorPoint());
    var size = label.getContentSize();
    var clip_node = ui_utils.clipWithNode(node, node, inverted);

    var chartlet = cc.Scale9Sprite.create(pngFile);
    chartlet.setAnchorPoint(label.getAnchorPoint());
    chartlet.setContentSize(size);
    clip_node.addChild(chartlet);

    return clip_node;
}
// clip node
// size: number for circle, size for rect
// Notice: clip node with rect, the def clip rect anchor is (0.5,0) for role clipping.
ui_utils.clipNode = function (node, size, inverted) {
    
    // set stencil
    var stencil;
    var alpha;

    if (typeof size == 'number') {
        stencil = cc.Sprite.create(global.res.png('circle'));
        stencil.setScale(size / stencil.getContentSize().width);
    } else if (size.width != undefined) {
        stencil = cc.LayerColor.create(cc.GREEN, size.width, size.height);
        stencil.ignoreAnchorPointForPosition(false);
        stencil.setAnchorPoint(cc.p(0.5, 0));
        alpha = 'none';
    }
    
    return ui_utils.clipWithNode(node, stencil, inverted, alpha);
}

// clip with node
ui_utils.clipWithNode = function (node, stencil, inverted, alpha) {
    // create clip node

    if(global.isNull(node))
    {
        return null;
    }

    var clip_node = cc.ClippingNode.create();
    clip_node.setAnchorPoint(cc.POINT_ZERO);
    clip_node.addChild(node);

    // set stencil
    if (alpha != 'none') {
        clip_node.setAlphaThreshold(alpha == undefined ? 0.05 : alpha);
    }

    clip_node.setStencil(stencil);
    if (inverted != undefined) {
        clip_node.setInverted(inverted);
    }

    // extend clip node
    clip_node.setAnchorPoint = function (anchor) {
        stencil.setAnchorPoint(anchor);
    }
    clip_node.stencil = stencil;
    
    return clip_node;
}

// clip rect
// design: use scroll view
ui_utils.clipRect = function (node, size) {
    var scroll_view = cc.ScrollView.create(size, node);
    scroll_view.setBounceable(false);
    scroll_view.setTouchEnabled(false);

    // set anchor
    scroll_view.__setAnchorPoint = scroll_view.setAnchorPoint;
    scroll_view.setAnchorPoint = function (anchor) {
        this.__setAnchorPoint(anchor);
        node.setPosition(cc.p(size.width * anchor.x, size.height * anchor.y));
    }    
    scroll_view.setAnchorPoint(node.getAnchorPoint());

    return scroll_view;
}

// clip with ref node
// Notice: they must have the same parent
ui_utils.clipWithRefNode = function (ref_node, ref_mask, inverted) {
    var parent = ref_node.getParent();
    global.node.removeChildHold(parent, ref_node);
    global.node.removeChildHold(parent, ref_mask);
    var clip_node = global.ui_utils.clipWithNode(ref_node, ref_mask, inverted);
    parent.addChild(clip_node);

    ref_node.release();
    ref_mask.release();
    return clip_node;
}

// create multi line label, we can set line span
ui_utils.createMemoLabel = function (ref_label, line_span, not_add) {    

    // create a new node
    var new_node = {};
    var obj = cc.Node.create();
    // make js obj bind to native obj.
    new_node.__proto__ = obj;
    __associateObjWithNative(new_node, obj);
    
    new_node.line_width = -1;
    new_node.line_span = line_span || ref_label.getFontSize();
    new_node.align = 1;     // 0 left, 1 center, 2 right

    // set string
    new_node.setString = function (str) {
        this.removeAllChildren();

        if (this.line_width > 0) {
            str = game_utils.strenter(str, this.line_width);
        }
        
        // split by \n
        var parts = str.split('\n');        
        var i = parts.length;
        var offset = cc.p(0, 0);
        var max_size = cc.size(0, 0);
        var anchor_point = cc.p(0.5 * this.align, 0);
        
        while (i--) {
            var label = cc.LabelTTF.create(parts[i], ref_label.getFontName(), ref_label.getFontSize());
            label.setAnchorPoint(anchor_point);
            label.setPosition(offset);
            if (this.color) {
                label.setColor(this.color);
            }
            this.addChild(label);

            var cont_size = label.getContentSize();
            offset.y += (cont_size.height + this.line_span);
            if (cont_size.width > max_size.width) {
                max_size.width = cont_size.width;
            }
        }
        
        if (this.align > 0) {
            var offset_x = max_size.width * anchor_point.x;
            ui_utils.visitNodeChildren(this, function (child) {
                child.setPositionX(offset_x);
            });
        }

        max_size.height = Math.abs(offset.y) - this.line_span;
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setContentSize(max_size);
    }

    // set line span
    new_node.setLineSpan = function (line_span) {
        var old_span = this.line_span;
        this.line_span = line_span;

        var offset_y = this.line_span - old_span;
        ui_utils.visitNodeChildren(this, function (child) {
            child.setPositionY(child.getPositionY() + offset_y);
        });
    }

    // set align
    new_node.setAlign = function (align) {
        if (this.align != align) {
            this.align = Number(align);

            var max_size = this.getContentSize();
            var anchor_point = cc.p(0.5 * this.align, 0);
            ui_utils.visitNodeChildren(this, function (child) {
                child.setAnchorPoint(anchor_point);
                var offset_x = max_size.width * anchor_point.x;
                child.setPositionX(offset_x);
            });
        }
    }

    // set color
    new_node.setColor = function (color) {
        this.color = color;
        ui_utils.visitNodeChildren(new_node, 'setColor', arguments);
    }

    if (!not_add) {
        // add to ref label parent
        ref_label.getParent().addChild(new_node);
        new_node.setPosition(ref_label.getPosition());
        ref_label.setVisible(false);
        new_node.setColor(ref_label.getColor());

        // get line width from ref node tag
        if (ref_label.getTag() > 0) {
            new_node.line_width = ref_label.getTag();
        }
    }

    return new_node;
}

// draw rect
ui_utils.createDrawRect = function (rect, color, draw_node) {
    if (color == undefined) {
        color = cc.c4f(0, 1, 0, 1);
    }

    if (!draw_node) {
        draw_node = cc.DrawNode.create();
    } else {
        draw_node.clear();
    }
    
    draw_node.drawSegment(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y), 1, color);
    draw_node.drawSegment(cc.p(rect.x, rect.y), cc.p(rect.x, rect.y + rect.height), 1, color);
    draw_node.drawSegment(cc.p(rect.x + rect.width, rect.y + rect.height), cc.p(rect.x + rect.width, 0), 1, color);
    draw_node.drawSegment(cc.p(rect.x + rect.width, rect.y + rect.height), cc.p(0, rect.y + rect.height), 1, color);

    return draw_node;
}

// long touch menu
ui_utils.createLongTouchMenu = function (menu) {
    menu = menu || cc.Menu.create();
    menu.long_touch = false;
    menu.long_time = 1.0;

    menu.setCallback = function (long_call) {
        this.long_call = long_call;
    }

    menu.callback = function (sel) {
        if (sel === undefined) {
            sel = menu.getSelectedItem();
        }
        if (menu.last_sel != sel) {
            if (menu.long_call && (typeof menu.long_call == 'function')) {
                menu.long_call(sel, menu.last_sel);
            } else if (menu.node) {
                if (sel) {
                    var node = menu.node || menu.getParent();
                    var callback = node['press_' + sel.ownerName];
                    if (callback) {
                        callback.call(node);
                    }
                }
            }

            menu.last_sel = sel;
        }
    }

    menu.onTouchBegan = function (touch) {
        menu.long_touch = false;
        menu.stopActionByTag(19);
        var action = global.createDelayCall(menu.long_time, function () {
            if (menu.getSelectedItem()) {
                menu.long_touch = true;
                menu.callback();
            }
        });
        action.setTag(19);
        menu.runAction(action);
    }

    menu.onTouchMoved = function () {
        if (menu.long_touch) {
            menu.callback();
        }
    }

    menu.onTouchEnded = function () {
        menu.stopActionByTag(19);
        menu.long_touch = false;
        menu.callback(null);
    }

    menu.onTouchCancelled = function () {
        menu.stopActionByTag(19);
        menu.long_touch = false;
        menu.callback(null);
    }

    return menu;
}

// multi touch menu
ui_utils.createMultiTouchMenu = function (menu) {
    menu = menu || cc.Menu.create();    
    menu.call_dt = 0.1;

    menu.setCallback = function (long_call) {
        this.long_call = long_call;
    }

    menu.callback = function () {
        if (!menu.isValidNative()) {
            menu.clear();
            return;
        }
        var sel = menu.getSelectedItem();
        if (sel) {
            if (menu.long_call && (typeof menu.long_call == 'function')) {
                menu.long_call(sel);
            } else if (menu.node) {
                var node = menu.node || menu.getParent();
                var callback = node['press_' + sel.ownerName];
                if (callback) {
                    callback.call(node);
                }
            }
        }
    }

    menu.clear = function () {
        if (menu.timer) {
            clearInterval(menu.timer);
            menu.timer = null;
        }
        menu.stopAllActions();
    }

    menu.onTouchBegan = function (touch) {
        menu.clear();
        menu.runAction(global.createDelayCall(0.2, function () {
            menu.timer = setInterval(menu.callback, menu.call_dt * 1000);
        }));
    }

    menu.onTouchEnded = function () {
        menu.clear();
    }

    menu.onTouchCancelled = function () {
        menu.clear();
    }

    return menu;
}

ui_utils.runBtnAction = function (btn) {
    if (btn.getActionByTag(1919)) {
        return;
    }

    var sx = btn.getScaleX();
    var sy = btn.getScaleY();
    var s = 0.7;
    var action = cc.Sequence.create(
        cc.DelayTime.create(0.1 * s),
        cc.ScaleTo.create(0.1 * s, 1.1 * sx, 0.9 * sy),
        cc.ScaleTo.create(0.08 * s, 0.9 * sx, 1.1 * sy),        
        cc.ScaleTo.create(0.2 * s, 1 * sx, 1 * sy),
        cc.DelayTime.create(0.05 * s),
        cc.CallFunc.create(function () {
            ui_utils.stopBtnAction(btn);
        })
    );
    action.setTag(1919);

    if (btn.__sx === undefined) {
        btn.__sx = sx;
        btn.__sy = sy;
    }
    btn.runAction(action);
}

ui_utils.stopBtnAction = function (btn) {
    btn.stopActionByTag(1919);
    btn.setScaleX(btn.__sx);
    btn.setScaleY(btn.__sy);
}

ui_utils.setMenuTouchEffect = function (menu) {
    menu.__has_touch_effect = true;

    var old_b = menu.onTouchBegan;
    var sel;
    menu.onTouchBegan = function () {
        // play effect
        sel = menu.getSelectedItem();
        if (sel) {
            ui_utils.runBtnAction(sel);
        }

        return old_b && old_b();
    }

    var old_e = menu.onTouchEnded;
    menu.onTouchEnded = function () {
        if (sel) {
            //ui_utils.stopBtnAction(sel);
        }

        old_e && old_e();
    }
    menu.onTouchCancelled = menu.onTouchEnded;

    return menu;
}

// create menu factory
// type: long, mult
// param: menu, dt, callback
ui_utils.createMenu = function (type, param) {
    var menu;
    param = param || {};
    switch (type) {
        case 'long':
            menu = this.createLongTouchMenu(param.menu);
            if (!isNaN(param.dt)) {
                menu.long_time = param.dt;
            }
            break;
        case 'mult':
            menu = this.createMultiTouchMenu(param.menu);
            if (!isNaN(param.dt)) {
                menu.call_dt = param.dt;
            }
            break;
    }

    if (param.callback) {
        menu.setCallback(param.callback);
    }
    return menu;
}

// add image async
ui_utils.addImageAsync = function (files, callback, callback_i) {
    var all_count = files.length;
    var count = 0;
    var check_func = function (i) {
        if (callback_i) {
            callback_i(i);
        }
        if (++count >= all_count) {
            if (callback) {
                callback();
            }
        }
    }
    
    files.forEach(function (file, i) {
        cc.TextureCache.getInstance().addImageAsync(file, function () {
            check_func(i);
        });
    });

    if (all_count == 0) {
        if (callback) {
            callback();
        }
    }
}

// rich text
function RichText() {

}
RichText.prototype.__proto__ = cc.Node.prototype;

// update values only for strings
RichText.prototype.updateValues = function (values) {
    if (this.line_count > 0) {
        console.log('error: rich text multi line not support updateValues.');
        return;
    }

    if (this.nodes == undefined || values == undefined) {
        console.log('nodes or values are undefined.');
        return;
    }
    //console.log2(values);
    for (var i = 0; i < values.length; ++i) {
        var value_node = this.getChildByTag(-1000 + i);
        if (value_node instanceof cc.LabelTTF) {
            value_node.setString(values[i]);
        } else {
            console.log('value nodes ' + i + ' is not instance of LabelTTF');
            //console.log2(value_node);
        }
    }
    // reset pos
    var len = this.nodes.length;
    this.setContentSize(cc.size(0, 0));
    for (var i = 0; i < len; ++i) {
        var the_node = this.nodes[i];
        if (the_node instanceof cc.Node) {
            the_node.setPosition(cc.p(this.getContentSize().width, 0));

            // add parent's content size to align child label
            var content_size = this.getContentSize();
            content_size.width += the_node.getContentSize().width;
            content_size.height = the_node.getContentSize().height;
            this.setContentSize(content_size);
        }
    }
}

// note: now this can only be called internally
//  just make one line labels into multi line labels
RichText.prototype._setLineCount = function (count) {
    if (count > 0) {
        this.line_count = count;

        if (count % 2 != 0) {
            console.log('warning: the text line count must be even considering chinese:', count);
        }
        var nodes = this.nodes;

        var cur = 0;
        var line = 0;
        var dy = this.getContentSize().height;
        var x = 0;

        var size = cc.size(0, 0);

        var new_nodes = [];
        for (var i = 0; i < nodes.length; ++i) {
            var n = nodes[i];
            var str = n.getString();
            var len = global.fn.strlen(str);
            if (len + cur > count) {
                // more
                var s0 = global.fn.substr(str, count - cur);
                n.setString(s0);
                n.line = line;
                n.setPosition(cc._p(x, -line * dy));
                new_nodes.push(n);

                if (size.width === 0) {
                    size.width = x + n.getContentSize().width;
                }

                ++line;
                x = 0;
                cur = 0;

                str = str.slice(s0.length);
                len = global.fn.strlen(str);

                var s0;
                for (; ;) {
                    if (cur + len >= count) {
                        s0 = global.fn.substr(str, count - cur);
                    } else {
                        s0 = str;
                    }

                    var label = n.copyNode();
                    n.getParent().addChild(label);

                    delete label.setString;
                    label.setString(s0);
                    label.line = line;
                    label.setPosition(cc._p(x, -line * dy));
                    new_nodes.push(label);

                    if (s0.length < str.length) {
                        str = str.slice(s0.length);
                        len = global.fn.strlen(str);
                        
                        ++line;
                    } else {
                        cur = global.fn.strlen(str);
                        x = label.getContentSize().width;
                        break;
                    }
                }
            } else if (len + cur === count) {
                if (size.width === 0) {
                    size.width = x + n.getContentSize().width;
                }

                // equal
                cur = 0;
                n.line = line;
                n.setPosition(cc._p(x, -line * dy));
                x = 0;

                new_nodes.push(n);
                ++line;
            } else {
                // less
                cur += len;
                n.line = line;
                n.setPosition(cc._p(x, -line * dy));
                x += n.getContentSize().width;

                new_nodes.push(n);
            }
        }

        if (size.width === 0) {
            size.width = x;
        }
        size.height = dy * (line + 1);
        this.setContentSize(size);

        // move up all
        this.nodes = new_nodes;
        dy *= line;
        for (var i = 0; i < new_nodes.length; ++i) {
            var n = new_nodes[i];
            n.setPositionY(n.getPositionY() + dy);
        }
    }
}

RichText.parseValue = function (type, colors, def_color, val) {
    if (val instanceof Array) {
        if (val.length == 0) {
            //console.log("values empty.");
            return { val: "", color: def_color };
        }
        val = val.shift();
    }

    //delay to first use.
    if (RichText.colors === undefined) {
        RichText.colors = global.data.tables.GuildWarColor;
    }
    var colors = colors || RichText.colors;

    var ret = {}
    var big_type = type.match(/[a-zA-Z]+/);    // \w+ includes 0-9
    //console.log('type = ' + type + ' big_type = ' + big_type);
    if (colors[type] != undefined) {
        ret.color = colors[type].color;
    } else {
        ret.color = def_color;
    }
    switch (big_type[0]) {
        default:
            ret.val = val;
            break;
    }
    return ret;
}

function CharToInt(val) {
    // is num
    if (!isNaN(val)) {
        return Number(val);
    } else {
        val = val.toLowerCase();
        return (val.charCodeAt(0) - 'a'.charCodeAt(0)) + 10;
    }
}

function HexToDec(val) {
    // charCodeAt(0)
    return (CharToInt(val[0]) * 16 + CharToInt(val[1]));
}

function convertColor(label_color) {
    if (label_color.r !== undefined) {
        return label_color;
    }

    var color_str = label_color.toString();
    var start_index = color_str.indexOf('#') + 1;
    var r_char = color_str.slice(start_index, start_index + 2);
    var g_char = color_str.slice(start_index + 2, start_index + 4);
    var b_char = color_str.slice(start_index + 4, start_index + 6);
    return {
        r: HexToDec(r_char),
        g: HexToDec(g_char),
        b: HexToDec(b_char)
    };
}
global.convertColor = convertColor;

// add a color label to new node
RichText.addColorLabel = function (parent_node, label_text, label_color, ref_ttf, count) {
    //console.log('add', label_color, label_text)

    var label = cc.LabelTTF.create(label_text, ref_ttf.getFontName(), ref_ttf.getFontSize());
    label.setAnchorPoint(cc.POINT_ZERO);
    label.setPosition(cc.p(parent_node.getContentSize().width, 0));
    label.setHorizontalAlignment(ref_ttf.getHorizontalAlignment());
    label.setVerticalAlignment(ref_ttf.getVerticalAlignment());
    label.setColor(convertColor(label_color));

    // add parent's content size to align child label
    var content_size = parent_node.getContentSize();
    content_size.width += label.getContentSize().width;
    content_size.height = label.getContentSize().height;
    parent_node.setContentSize(content_size);

    // add the label
    parent_node.addChild(label);
    parent_node.nodes[count] = label;
    return label;
}

ui_utils.createRichText = function (ref_ttf, text, values, init_color, colors) {
    //delay to first use.
    if (RichText.colors === undefined) {
        RichText.colors = global.data.tables.GuildWarColor;
    }
    // color table
    var colors = colors || RichText.colors;
    init_color = init_color || (colors.default ? colors.default.color : ref_ttf.getColor());
    var def_color = init_color;

    // parse keys
    var color_keys = [];
    
    // {color_key [= "value"] [new_key = "value"]}
    //var results = text.match(/\{\w+(\s*=\s*\'[\w#:\+]+\')?\s?(,\s*\w+\s*=\s*\'[\w#:\+]+\')*\}/g);
    var results = text.match(/\{\w+(\s*=\s*\'[\x80-\xFF\w#:\+]+\')?\s?(,\s*\w+\s*=\s*\'[\x80-\xFF\w#:\+]+\')*\}/g);
    if (!results || results.length == 0) {
        //console.log('match text failed: ', text);
    }
    //console.log('ret:', results);

    // split key value pairs        
    for (var i in results) {
        var the_color = results[i].slice(1, results[i].length - 1);   // clear { }
        the_color = the_color.replace(/[\t\n ]+/g, '');               // replace space tab etc.
        var key_values = the_color.split(',');
        //console.log(key_values);

        // parse values
        var index = 0;
        var color_key = {};
        var is_def_color = false;
        for (var j in key_values) {
            var key_value = key_values[j].split('=');

            // 1st time set key field                
            var key_name = key_value[0];
            if (index == 0) {
                key_name = "val";
                color_key.key = key_value[0];
            }

            // set the value from 'xxx'
            if (key_value.length > 1) {
                color_key[key_name] = key_value[1].replace(/\'/g, '');
            }

            ++index;
        }

        // push to array
        color_keys.push(color_key);
        // set def color
        if (color_key["def_color"] !== undefined) {
            //console.log("is_def_color in: " + color_key.key);
            color_key.val = "";
            if (colors[color_key.key] !== undefined)
                def_color = colors[color_key.key].color;
            else
                def_color = init_color;
        }
    }

    // parse a value from values
    var copy_values = {};
    if (values !== undefined)
        copy_values = values.slice(0);
    
    // create a new node
    var new_node = cc.Node.create();
    new_node.__proto__ = RichText.prototype;
    new_node.nodes = [];

    new_node.setAnchorPoint(ref_ttf.getAnchorPoint());
    new_node.setPosition(ref_ttf.getPosition());
    ref_ttf.getParent().addChild(new_node);
    ref_ttf.setVisible(false);

    // parse the text and create label    
    var last_pos = 0;
    var cur_pos = 0;
    var temp_text = "";
    var str_len = text.length;
    var var_count = 0;
    var tag = -1;
    var label_count = 0;
    
    for (var i = 0; i < color_keys.length; ++i) {
        var info = color_keys[i];
        cur_pos = text.indexOf('{', last_pos);

        // add normal text            
        if (cur_pos > last_pos) {
            temp_text = text.slice(last_pos, cur_pos);
            RichText.addColorLabel(new_node, temp_text, def_color, ref_ttf, label_count++);
        }

        // add replace text
        tag = -1;
        if (info.def_color !== undefined) {
            last_pos = text.indexOf('}', cur_pos + 1) + 1;
            cur_pos = last_pos;
            continue;
        }
        if (info.val == undefined) {
            var temp_val = RichText.parseValue(info.key, colors, def_color, copy_values);
            info.val = temp_val.val;
            // if color isn't set in {}, then set it by var
            if (info.color == undefined)
                info.color = temp_val.color;
            tag = -1000 + var_count;
            var_count++;
        } else {
            if (info.color == undefined)
                info.color = colors[info.key].color;
        }
        var new_label = RichText.addColorLabel(new_node, info.val, info.color, ref_ttf, label_count++);
        new_label.setTag(tag);
        //console.log('tag=' + tag);

        // update last pos
        last_pos = text.indexOf('}', cur_pos) + 1;
        cur_pos = last_pos;
    }

    // add tail label
    if (cur_pos < str_len) {
        temp_text = text.slice(cur_pos, str_len);
        RichText.addColorLabel(new_node, temp_text, def_color, ref_ttf, label_count++);
    }

    // set line count
    new_node._setLineCount(ref_ttf.getTag());
    
    return new_node;
}

// create rich label ttf
// {param
// ref_ttf:
// text:        {color_key} {color_key='const_value'} {color_key,color='#rrggbb',def_color='1'}
// values:      [val, val, val]
// can_click:   boolean, callback func name = "click"
// param}
// notice:  if def_color="1", not add the label
//          set black def color: {label, def_color='1'}
ui_utils.createRichLabel = function (ref_ttf, text, values, can_click) {

    //console.log('createRichLabel: text = ' + text + ', values = ' + values);
    //var colors = global.data.tables["NoticeColor"]["NOTICECOLORDES"];
    //var def_color = colors["default"].COLOR;
    var colors = {};
    //var def_color = '#000000';
    var init_color = ref_ttf.getColor(); 
    var def_color = init_color;
    
    // parse keys
    var color_keys = [];
    (function () {
        // {color_key [= "value"] [new_key = "value"]}
        //var results = text.match(/\{\w+(\s*=\s*\'[\w#:\+]+\')?\s?(,\s*\w+\s*=\s*\'[\w#:\+]+\')*\}/g);
        var results = text.match(/\{\w+(\s*=\s*\'[\x80-\xFF\w#:\+]+\')?\s?(,\s*\w+\s*=\s*\'[\x80-\xFF\w#:\+]+\')*\}/g);
        //console.log('ret:', results);
        if (!results || results.length == 0) {
            console.log('match text failed: ', text);
        }
        
        // split key value pairs        
        for (var i in results) {
            var the_color = results[i].slice(1, results[i].length - 1);   // clear { }
            the_color = the_color.replace(/[\t\n ]+/g, '');               // replace space tab etc.
            var key_values = the_color.split(',');
            //console.log(key_values);

            // parse values
            var index = 0;
            var color_key = {};
            var is_def_color = false;
            for (var j in key_values) {
                var key_value = key_values[j].split('=');

                // 1st time set key field                
                var key_name = key_value[0];
                if (index == 0) {
                    key_name = "val";
                    color_key.key = key_value[0];
                }

                // set the value from 'xxx'
                if (key_value.length > 1) {
                    color_key[key_name] = key_value[1].replace(/\'/g, '');
                }

                ++index;
            }
           
            // push to array
            color_keys.push(color_key);
            // set def color
            if (color_key["def_color"] !== undefined) {
                //console.log("is_def_color in: " + color_key.key);
                color_key.val = "";
                if (colors[color_key.key] !== undefined)
                    def_color = colors[color_key.key].COLOR;
                else
                    def_color = init_color;
            }

            //             var temp_key_info = '';
            //             for (var temp_key in color_key)
            //                 temp_key_info += ('[' + temp_key + '] = ' + color_key[temp_key] + ',');
            //             console.log2(temp_key_info);
        }

    }());

    // parse a value from values
    var copy_values = {};
    if (values !== undefined)
        copy_values = values.slice(0);
    function parseValue(type) {
        if (copy_values.length == 0) {
            console.log("values empty.");
            return { val: "", color: def_color };
        }
        var val = copy_values.shift();
        var ret = {}
        var big_type = type.match(/[a-zA-Z]+/);    // \w+ includes 0-9
        //console.log('type = ' + type + ' big_type = ' + big_type);
        if (colors[type] != undefined) {
            ret.color = colors[type].COLOR;
        } else {
            ret.color = def_color;
        }
        switch (big_type[0]) {
            /*
            case 'role':
                var role_data = global.data.tables["Role"]["ROLEDES"][val];
                ret.val = role_data.Name;
                break;
            case 'item':
                var item_data = global.fn.getConfigInfoById(val);
                ret.val = item_data.name;
                break;
            case 'equip':
                var equip_data = global.data.tables["Equip"]["EQUIPDES"][val];
                ret.val = equip_data.Name;
                break;
                */
            default:
                ret.val = val;
                break;
        }
        return ret;
    }

    // add a color label to new node
    var menu_count = 0;
    var label_count = 0;
    function addColorLabel(parent_node, label_text, label_color, can_click) {
        if (arguments.length < 4) {
            can_click = false;
        }

        var label = cc.LabelTTF.create(label_text, ref_ttf.getFontName(), ref_ttf.getFontSize());
        label.setAnchorPoint(cc.POINT_ZERO);
        label.setPosition(cc.p(parent_node.getContentSize().width, 0));
        label.setHorizontalAlignment(ref_ttf.getHorizontalAlignment());
        label.setVerticalAlignment(ref_ttf.getVerticalAlignment());
        label.setColor((function () {
            if (label_color.r !== undefined) {
                return label_color;
            }

            var color_str = label_color.toString();
            var start_index = color_str.indexOf('#') + 1;
            var r_char = color_str.slice(start_index, start_index + 2);
            var g_char = color_str.slice(start_index + 2, start_index + 4);
            var b_char = color_str.slice(start_index + 4, start_index + 6);

            //             console.log(label_color);
            //             console.log(r_char);
            //             console.log(g_char);
            //             console.log(b_char);

            function CharToInt(val) {
                // is num
                if (!isNaN(val)) {
                    return Number(val);
                } else {
                    val = val.toLowerCase();
                    return (val.charCodeAt(0) - 'a'.charCodeAt(0)) + 10;
                }
            }
            function HexToDec(val) {
                // charCodeAt(0)
                return (CharToInt(val[0]) * 16 + CharToInt(val[1]));
            }
            return {
                r: HexToDec(r_char),
                g: HexToDec(g_char),
                b: HexToDec(b_char)
            };
        }()));

        // add parent's content size to align child label
        var content_size = parent_node.getContentSize();
        content_size.width += label.getContentSize().width;
        content_size.height = label.getContentSize().height;
        parent_node.setContentSize(content_size);

        // add the label
        if (can_click) {
            //var menu_item = cc.MenuItemLabel.create(label);
            var menu_item = cc.MenuItemSprite.create(label, label);
            menu_item.setAnchorPoint(label.getAnchorPoint());
            menu_item.setPosition(label.getPosition());
            label.setPosition(cc.POINT_ZERO);
            // set call back
            menu_item.setCallback(function (sender) {
                if (typeof this.click === "function") {
                    this.click(sender.getTag());
                }
            }, parent_node);
            menu.addChild(menu_item, 0, menu_count++);
        } else {
            parent_node.addChild(label);
        }
        parent_node.nodes[label_count++] = label;
        return label;
    }

    // create a new node
    var new_node = {};
    var obj = cc.Node.create();
    //make js obj bind to native obj.
    new_node.__proto__ = obj;
    __associateObjWithNative(new_node, obj);
    new_node.nodes = [];

    new_node.setAnchorPoint(ref_ttf.getAnchorPoint());
    new_node.setPosition(ref_ttf.getPosition());
    ref_ttf.getParent().addChild(new_node);
    ref_ttf.setVisible(false);

    // if can_click, create a CCMenu
    var menu = null;
    if (arguments.length >= 4 && can_click === true) {
        menu = cc.Menu.create();
        menu.setPosition(cc.POINT_ZERO);
        new_node.addChild(menu);
    }

    // parse the text and create label    
    var last_pos = 0;
    var cur_pos = 0;
    var temp_text = "";
    var str_len = text.length;
    var var_count = 0;
    var tag = -1;
    for (var i = 0; i < color_keys.length; ++i) {
        var info = color_keys[i];
        cur_pos = text.indexOf('{', last_pos);

        // add normal text            
        if (cur_pos > last_pos) {
            temp_text = text.slice(last_pos, cur_pos);
            addColorLabel(new_node, temp_text, def_color);
        }

        // add replace text
        tag = -1;
        if (info.def_color !== undefined) {
            last_pos = text.indexOf('}', cur_pos + 1) + 1;
            cur_pos = last_pos;
            continue;
        }
        if (info.val == undefined) {
            var temp_val = parseValue(info.key);
            info.val = temp_val.val;
            // if color isn't set in {}, then set it by var
            if (info.color == undefined)
                info.color = temp_val.color;
            tag = -1000 + var_count;
            var_count++;
        } else {
            if (info.color == undefined)
                info.color = colors[info.key].COLOR;
        }
        var new_label = addColorLabel(new_node, info.val, info.color, can_click);
        new_label.setTag(tag);
        //console.log('tag=' + tag);

        // update last pos
        last_pos = text.indexOf('}', cur_pos) + 1;
        cur_pos = last_pos;
    }

    // add tail label
    if (cur_pos < str_len) {
        temp_text = text.slice(cur_pos, str_len);
        addColorLabel(new_node, temp_text, def_color);
    }

    // extend the node
    // update values only for strings
    new_node.updateValues = function (values) {
        if (this.nodes == undefined || values == undefined) {
            console.log('nodes or values are undefined.');
            return;
        }
        //console.log2(values);
        for (var i = 0; i < values.length; ++i) {
            var value_node = this.getChildByTag(-1000 + i);
            if (value_node instanceof cc.LabelTTF) {
                value_node.setString(values[i]);
            } else {
                console.log('value nodes ' + i + ' is not instance of LabelTTF');
                //console.log2(value_node);
            }
        }
        // reset pos
        var len = this.nodes.length;
        this.setContentSize(cc.size(0, 0));
        for (var i = 0; i < len; ++i) {
            var the_node = this.nodes[i];
            if (the_node instanceof cc.Node) {
                the_node.setPosition(cc.p(this.getContentSize().width, 0));

                // add parent's content size to align child label
                var content_size = this.getContentSize();
                content_size.width += the_node.getContentSize().width;
                content_size.height = the_node.getContentSize().height;
                this.setContentSize(content_size);
            }
        }
    }
    return new_node;
}

// create curve diagram
ui_utils.CURVE_COLORS = [
    cc.c4f(0, 1, 0, 1),
    cc.c4f(1, 1, 0, 1),
    cc.c4f(0, 1, 1, 1),
    cc.c4f(1, 0, 1, 1),
];
ui_utils.createCurveDiagram = function () {
    var node = cc.Node.create();
    var holder = cc.Node.create();
    node.addChild(holder);
    node.holder = holder;
    node.color = cc.c4f(0, 1, 0, 1);
    node.draws = [];

    // make some method
    node.sx = 5;
    node.sy = 5;
    var win_size = global.screen_adapter.sizeToNode('design');
    node.getDrawNode = function (index) {
        if (!this.draws[index]) {
            var draw_node = cc.DrawNode.create();
            draw_node.last_pt = cc.POINT_ZERO;
            this.holder.addChild(draw_node);
            this.draws[index] = draw_node;
        }
        return this.draws[index];
    }
    node.add = function (val, dx, index) {
        dx = dx || 1;
        dx *= this.sx;
        val *= this.sy;
        index = index || 0;

        var draw_node = this.getDrawNode(index);
        var pt = cc.p(draw_node.last_pt.x + dx, val);
        draw_node.drawSegment(draw_node.last_pt, pt, 1, ui_utils.CURVE_COLORS[index % ui_utils.CURVE_COLORS.length]);
        draw_node.last_pt = pt;
        if (pt.x > win_size.width) {
            draw_node.setPositionX(win_size.width - pt.x);
        }
    }

    node.clear = function () {
        this.draws.forEach(function (draw_node) {
            draw_node.last_pt = cc.POINT_ZERO;
            draw_node.clear();
            draw_node.setPosition(cc.POINT_ZERO);
        });

    }

    node.line = function (val, color) {
        val *= this.sy;
        color = color || cc.c4f(1, 0, 0, 1);
        var draw_node = cc.DrawNode.create();
        this.addChild(draw_node);
        draw_node.drawSegment(cc.p(0, val), cc.p(win_size.width, val), 2, color);
        return draw_node;
    }

    return node;
}

// create parallax node
// ref_nodes: ref node array
// speeds: speed (number) array
ui_utils.createParallaxNode = function (ref_nodes, speeds) {
    var parallax = cc.ParallaxNode.create();
    if (ref_nodes) {
        speeds = speeds || [];
        ref_nodes.forEach(function (ref_node, i) {
            ref_node.retain();
            if (ref_node.getParent()) {
                ref_node.removeFromParent();
            }

            // ratio, offset
            parallax.addChild(ref_node, ref_node.getZOrder(), cc.p(speeds[i] || 0, 0), cc.p(0, 0));
            ref_node.release();
        });
    }

    return parallax;
}

// create progress bar
ui_utils.createProgressBar = function (file_prog, file_bg) {
    var node = cc.Node.create();

    if (file_bg) {
        var bg = cc.Sprite.create(file_bg);
        bg.setAnchorPoint(cc.p(0.5, 0.5));
        node.addChild(bg);
        node.bg = bg;
    }
    
    var prog = global.createProgressBar(file_prog);
    prog.setAnchorPoint(cc.p(0.5, 0.5));
    prog.setPercentage(100);
    node.addChild(prog);
    node.prog = prog;
    return node;
}

// bind data with ctrl
// Note: data_str must be a string, and the data must be hung on global
ui_utils.bindData = function (node, data_str, name, updater) {
    try {
        var nodes = this._getBindNodes(data_str + '_' + name);
        if (!nodes.__binded) {
            nodes.__binded = true;

            var data = eval(data_str);
            data['__' + name] = data[name];
            global.defineAttr(data, name, function () {
                return data['__' + name];
            }, function (value) {
                data['__' + name] = value;

                for (var i = 0; i < nodes.length; ++i) {
                    ui_utils._updateData(nodes[i], value, name);
                }
            });            
        }

        global.array.add(nodes, node);
        node.__updaters = node.__updaters || {};
        node.__updaters[name] = updater;
    } catch (e) {
        console.log('bind data [', data_str, '] failed:', e.message);
    }
}

ui_utils.unbindData = function (node, data_str, name) {
    var all_name = data_str + '_' + name;
    if (all_name.slice(0, 7) != 'global.') {
        all_name = 'global.' + all_name;
    }

    var nodes = this.bind_nodes[all_name];
    if (nodes) {
        if (node !== -1) {
            global.array.remove(nodes, node);
            if (node.__updaters) {
                delete node.__updaters[name];
            }
        } else {
            nodes.length = 0;
            delete node.__updaters;
        }
    }
}

// do update
ui_utils._updateData = function (node, value, name) {
    var updater = node.__updaters[name];
    if (!node.isValidNative()) {
        console.log('error: invalid native obj[%s].',name , updater);
        return;
    }
    if (updater) {
        if (typeof updater === 'function') {
            updater.call(node, value);
        } else if (typeof updater === 'string') {
            if (typeof node[updater] === 'function') {
                node[updater](value);
            } else {
                // setter
                node[updater] = value;
            }
        }
    } else {
        ui_utils._def_updater(node, value);
    }
}

// get binded nodes
ui_utils._getBindNodes = function (all_name) {
    if (all_name.slice(0, 7) != 'global.') {
        all_name = 'global.' + all_name;
    }
    if (!this.bind_nodes[all_name]) {
        this.bind_nodes[all_name] = [];
    }
    return this.bind_nodes[all_name];
}

// default updater
ui_utils._def_updater = function (node, value) {
    if (node && node.__value != value) {
        node.__value = value;

        if (node.isValidNative()) {
            // do update
            if (node instanceof cc.LabelTTF) {
                node.setString(value + '');
            }
        }
    }
}

// create touch layer: for just click region, considering sliding
// layer: if not specified, I'll create one
// rect: you must touch in this rect, it's the screen rect by default
// onTouchEnded: only callback if your touch distance is smaller than global.MOVE_INCH
// onTouchBegan: if you wanna determine whether handle the touch, you just set this function
ui_utils.createTouchLayer = function (layer, rect, onTouchEnded, onTouchBegan) {
    layer = layer || cc.Layer.create();
    layer.onTouchBegan = function (touch) {
        var pos = touch.getLocation();
        if (!this.getParent()) return false;
        pos = this.getParent().convertToNodeSpace(pos);
        
        if (rect && !cc.rectContainsPoint(rect, pos)) {
            return false;
        }
        
        var claimed = true;
        if (typeof onTouchBegan === 'function') {
            claimed = onTouchBegan.call(layer, touch) || false;
        }

        this.__start_pos = touch.getLocation();
        return claimed;
    }

    layer.onTouchEnded = function (touch) {
        var dist = cc.p.distance(touch.getLocation(), this.__start_pos);
        if (global.convertDistanceFromPointToInch(dist) < global.MOVE_INCH) {
            if (typeof onTouchEnded === 'function') {
                onTouchEnded.call(layer, touch);
            }
        }
    }

    return layer;
}

// set node's menu sons' touch effect
ui_utils.setNodeMenuTouchEffect = function (node) {
    ui_utils.visitNode(node, function (the_node) {
        if (the_node instanceof cc.Menu) {
            the_node.setTouchEffect();
            return true;
        }
    });
}

// tab ctrl
function TabCtrl(nodes, need_create) {
    this.nodes = nodes;
    this.need_create = need_create;

    // slice args for init
    this.init.apply(this, Array.prototype.slice.call(arguments, 2));
}

var TAB_CREATE_TYPE = {
    BTNS: 0,
    SCROLL_VIEW: 1
};

// args:
//  btns:   cb_create, cb_tab
//  scroll: cb_create, cb_tab, owner, btn_name
TabCtrl.prototype.init = function () {
    if (this.need_create) {
        // prepare create
        this.create_type = TAB_CREATE_TYPE.BTNS;   // 0 btns, 1 scrollview
        if (this.nodes.length <= 1) {
            this.create_type = TAB_CREATE_TYPE.SCROLL_VIEW;
        }
        
        this.ref = this.nodes[0];
        this.ref_name = this.ref.ownerName;
        this.scrollview_is_roll = true;

        switch (this.create_type) {
            case TAB_CREATE_TYPE.BTNS:
                this.dp = cc.p.sub(this.nodes[1].getPosition(), this.nodes[0].getPosition());
                this.ref.changeCallback('onTab', this);
                this.caches = [this.ref];
                break;
            case TAB_CREATE_TYPE.SCROLL_VIEW:
                var owner = arguments[2];
                var c = new global.fn.scrollview_factory(owner, this.ref_name);
                this.scroll_creator = c;
                c.initScrollViewItem = this.initTab.bind(this);
                var btn_name = arguments[3];
                this.btn_name = btn_name;
                c[btn_name + '_clicked'] = this.onTab.bind(this);
                this.caches = [];

                var view_is_roll = arguments[4];
                if (view_is_roll != undefined) 
                {
                    this.scrollview_is_roll = view_is_roll;
                }
                break;
        }

        this.cb_create = arguments[0];
        this.cb_tab = arguments[1];
    } else {
        // change cb
        this.cb_tab = arguments[0];
 
        var that = this;
        this.nodes.forEach(function (btn, i) {
            var func_name = 'press_btn_' + i;
            that[func_name] = function () {
                that.onTab(i);
            }
            btn.changeCallback(func_name, that);
        });

        this.caches = this.nodes;
    }
}

TabCtrl.prototype.create = function (num) {
    console.log('tab create:', num);
    if (this.need_create) {
        this.cur_index = -1;
        switch (this.create_type) {
            case TAB_CREATE_TYPE.BTNS:
                this.createBtns(num);
                break;
            case TAB_CREATE_TYPE.SCROLL_VIEW:
                this.createScroll(num);
                break;
        }
    } else {
        console.log('you must set need create flag in constructor.');
    }
}

TabCtrl.prototype._addBtn = function (last, i, pos) {
    var that = this;

    var mounter = {};
    mounter[this.ref_name + '_clicked'] = this.onTab.bind(this, i);
    var btn = last.copyNode(mounter);
    last.getParent().addChild(btn);
    cc.p._add(pos, this.dp);
    btn.setPosition(pos);

    this.caches.push(btn);

    return btn;
}

TabCtrl.prototype.createBtns = function (num) {
    var cache_num = this.caches.length;
    if (cache_num < num) {
        var last = this.caches[cache_num - 1];
        var pos = last.getPosition();
        for (var i = cache_num; i < num; ++i) {
            var btn = this._addBtn(last, i, pos);
            last = btn;
        }
        cache_num = this.caches.length;
    }

    for (var i = 0; i < cache_num; ++i) {
        var btn = this.caches[i];
        if (i < num) {
            this.selBtn(btn, false);
            btn.setVisible(true);
            this.initTab(i, btn);
        } else {
            btn.setVisible(false);
        }
    }
}

TabCtrl.prototype.createScroll = function (num) {
    this.caches.length = 0;
    this.my_scroll_view = this.scroll_creator.create(num);

    this.my_scroll_view.setBounceable(this.scrollview_is_roll);
    this.my_scroll_view.setTouchEnabled(this.scrollview_is_roll);
}

TabCtrl.prototype.initTab = function (i, btn) {
    if (this.create_type == TAB_CREATE_TYPE.SCROLL_VIEW) {
        if (i == this.cur_index) {
            this.selBtn(btn, true);
        }
        this.caches.push(btn);
    }
    
    this.cb_create && this.cb_create(i, btn);
}

TabCtrl.prototype.onTab = function (i) {
    if (typeof i !== 'number') {
        i = 0;
    }

    console.log('on tab:', i);
    this.setCurIndex(i);
}

TabCtrl.prototype.setCurIndex = function (cur) {
    if (this.cur_index !== cur) {
        if (this.cur_index !== undefined) {
            var last = this.caches[this.cur_index];
            if (last) this.selBtn(last, false);
        }

        var btn = this.caches[cur];
        this.selBtn(btn, true);
        this.cur_index = cur;

        this.cb_tab && this.cb_tab(cur);
    }
}

TabCtrl.prototype.selBtn = function (btn, sel) {
    if (!btn) return;
    switch (this.create_type) {
        case TAB_CREATE_TYPE.SCROLL_VIEW:
            btn = btn[this.btn_name];
            break;
    }

    if (btn) {
        if (sel) {
            btn.setEnabled(false);
            btn.selected();
        } else {
            btn.setEnabled(true);
            btn.unselected();
        }
    }
}

ui_utils.TabCtrl = TabCtrl;

ui_utils.createListFromRef = function (refs, num, cb, copy) {
    var ref = refs[0];
    var dp = cc.p._sub(refs[1].getPosition(), refs[0].getPosition());
    var last = ref.getPosition();
    var node;
    for (var i = 0; i < num; ++i) {
        if (copy) {
            if (i > 0) {
                node = ref.copyNode();
                ref.getParent().addChild(node);
            } else {
                node = ref;
            }
            cb(i, node);
        } else {
            node = cb(i);
        }

        if (i > 0) {
            cc.p._add(last, dp);
        }
        node.setPosition(last);
    }
}

// debug ui: show info of current status
ui_utils.debugUI = function (ccbi) {
    if (this.tmp_node) {
        this.tmp_node.removeFromParent();
        this.tmp_node = null;
    }

    var node;
    if (ccbi) {        
        // load ccbi
        node = {};
        global.fn.loadui(global.res.ccbi(ccbi), node);

        g_smgr.main_scene.addChild(node);
        node.refresh(cc.layer_frame - 1);

        this.tmp_node = node;
    } else {
        node = g_smgr.getStatusNode(g_smgr.current_name);
    }

    if (node) {
        this.debug_info = [];
        this.visitNode(node, this._debugNode);

        if (!this.debug_node) {
            var n = cc.Node.create();
            g_smgr.main_scene.addChild(n);
            global.screen_adapter.adaptUI(n);
            n.refresh(cc.layer_frame);

            this.debug_node = n;
        }
        this.debug_node.removeAllChildren();
        
        var str = '';
        for (var i = 0; i < this.debug_info.length; ++i) {
            str += this._showDebugNode(this.debug_info[i]);
        }

        console.log('\n---------------debug ui: %j---------------\n',
            ccbi || g_smgr.current_name, str);
    }
}

ui_utils._debugNode = function (node, depth) {
    var info = {
        node: node,
        depth: depth,
        name: node.ownerName,
        id: ui_utils.debug_info.length,
    };

    var stop;
    if (node instanceof cc.LabelTTF) {
        info.type = 'ttf';
        info.text = node.getString();
    } else if (node instanceof cc.LabelBMFont) {
        info.type = 'bmf';
        info.text = node.getString();
    } else if (node instanceof cc.Menu) {
        info.type = 'menu';
    } else if (node instanceof cc.MenuItemSprite) {
        info.type = 'btn';
        info.cb = node.__callback_name;
    } else if (node instanceof cc.Sprite) {
        info.type = 'spr';
    } else if (node instanceof cc.Scale9Sprite) {
        info.type = 'spr9';
        stop = true;
    } else {
        info.type = 'node';
    }

    if (node.getTag() != -1) {
        info.tag = node.getTag();
    }

    ui_utils.debug_info.push(info);

    return stop;
}

ui_utils._showDebugNode = function (info) {
    // make desc string
    var str = '';
    for (var i = 0; i < info.depth; ++i) {
        str += '  ';
    }

    str += '[' + info.id + '] '
    if (info.name) str += info.name;
    str += ' ' + info.type + ': ';
    if (info.cb) {
        str += 'cb=' + info.cb + ' ';
    }
    if (info.tag) {
        str += 'tag=' + info.tag + ' ';
    }
    if (info.text) {
        str += 'text=' + info.text + ' ';
    }

    str += '\n';

    // show label
    var p = this.debug_node;
    var label = cc.LabelTTF.create(info.id, 'Arial', 24);
    var color = global.debug_colors[global.random.getInt(global.debug_colors.length)];
    label.setColor(color);
    label.setPosition(global.node.convertFromTo(info.node, p));
    p.addChild(label);

    return str;
}
/**
 * 使用节点剪裁图片
 * @param  node 原节点
 * @param pngID 底板图片文件的代号 {a|b|..}可自行添加
 * @param inverted 是否显示被剪裁下的部分
 * @return 返回Clipnode {cc.ClippingNode}
 */
ui_utils.clipedWithPng = function (node ,pngID,inverted) {
    var size = node.getContentSize();
   //遮罩节点
    var stencilNode = node.copyNode();
    node.setVisible(false);

    var clip_node = cc.ClippingNode.create();
    clip_node.setPosition(node.getPosition());

    stencilNode.setPosition(cc.POINT_ZERO);
    clip_node.setAlphaThreshold(0.5);
    clip_node.setStencil(stencilNode);
    clip_node.stencil = stencilNode;
    if (inverted != undefined) {
        clip_node.setInverted(inverted);
    }

    //底板
    var pngFile = "/pic/gradient.png";
    switch(pngID){
        case 'a':
            pngFile = "/pic/gradient.png";
            break;
        case 'b':
            pngFile = "/pic/qwe.jpg";
            break;
        default :
        {
            console.log("底板图片代号无法处理: "+pngID);
            pngFile = "/pic/gradient.png";
            break;
        }
    }
    var chartlet = cc.Sprite.create(pngFile);

   // chartlet.setAnchorPoint(cc.POINT_ZERO);
    chartlet.setScaleX(size.width * 1.3  / chartlet.getContentSize().width);
    chartlet.setScaleY(size.height * 1.1 / chartlet.getContentSize().height);
    //chartlet.setScaleX(size.width / chartlet.getContentSize().width);
    //chartlet.setScaleY(size.height / chartlet.getContentSize().width);
    clip_node.addChild(chartlet);

    return clip_node;
}

ui_utils.test = {
    do: function (assert, node) {
        var center = global.screen_adapter.design_center;
        var holder = cc.Node.create();
        node.addChild(holder, 1);
        holder.setPosition(center);
        this.node = holder;

        // bind data
        var label = cc.LabelTTF.create('test', 'Arial', 32);
        holder.addChild(label);
        
        ui_utils.bindData(label, 'main_data', '_test_bind');
        main_data._test_bind = 20;
        assert(label.getString() == main_data._test_bind);

        ui_utils.bindData(label, 'main_data', '_test_bind', 'setString');
        main_data._test_bind = 30;
        assert(label.getString() == main_data._test_bind);

        ui_utils.bindData(label, 'main_data', '_test_bind', function (val) {
            label.setString(val);
        });
        main_data._test_bind = 40;
        assert(label.getString() == main_data._test_bind);

        // unbind
        ui_utils.unbindData(label, 'main_data', '_test_bind');
        main_data._test_bind = 50;
        assert(label.getString() != main_data._test_bind);

        /*
        // set color
        var win_size = global.screen_adapter.design_size;
        var layer = cc.LayerColor.create(cc.c4b(0, 0, 0, 255 * 0.60), win_size.width, win_size.height);
        layer.setPosition(cc.p(-win_size.width / 2, -win_size.height / 2));
        holder.addChild(layer, -1);

        var spr1 = cc.Sprite.create(global.res.png('shiyong01'));
        var spr2 = cc.Sprite.create(global.res.png('shiyong02'));
        holder.addChild(spr1);
        spr1.setPosition(cc.p(0, 200));
        spr1.setColor(cc.c4b(209, 34, 34, 255));

        holder.addChild(spr2);
        spr2.setPosition(cc.p(0, -100));
        spr2.setScale(2);
        spr2.setColor(cc.c4b(209, 34, 34, 255));*/

        // rich text
        var ttf = cc.LabelTTF.create('333', 'Arial', 32);
        ttf.setPositionY(30);
        //ttf.setAnchorPoint(cc.p(0.5, 1));
        holder.addChild(ttf, 10);
        ttf.setColorEx('#ff0000')

        var line_count = 38;
        ttf.setTag(line_count);
        var format = '同时拥有【{hero1}】、【{color_wjh}】、【{color_wjh}】，攻击增加20%';
        var values = ['张飞', '关羽', '刘备'];
        var rt = ui_utils.createRichText(ttf, format, values);
    },
    done: function () {
        if (this.node) {
            this.node.removeFromParent();
            this.node = null;
        }
    }
}

ui_utils.copyNode = function (model, pri) {
    if (typeof pri === 'object') {
        pri = pri.getLayerLv() * cc.touchPriorityBase;
    }
    var priority_base = pri;

    var temp_nodes = model.getChildren();
    var element = cc.Node.create();
    for (var i = 0; i < temp_nodes.length; i++) {
        element.addChild(temp_nodes[i].copyNode(element, element, priority_base));
    }

    element.setContentSize(model.getContentSize());
    element.setAnchorPoint(model.getAnchorPoint());
    element.setScale(model.getScale());

    return element;
}
/**
 * 获取一个独立的shader实例
 * @param shaderObj {shader}
 * @returns {*}
 */
ui_utils.getIndependentShader = function(shaderObj){
    var sh = cc.GLProgram.createWithString(shaderObj.vsh, shaderObj.fsh);
    if(sh){
        sh.addAttribute("a_position", 0);
        sh.addAttribute("a_color", 1);
        sh.addAttribute("a_texCoord", 2);
        sh.link();
        sh.updateUniforms();
    }
    return sh;
}
/**
 * 使label变成渐变色，产生阴影
 * @author chenguanzhou
 * @param label
 * @param startColor 起始颜色 cc.c3b ,取值0-1
 * @param endColor   终止颜色 cc.c3b
 * @param enumColorType
 */
ui_utils.makeLabelGradiant = function(label,enumColorType){

     console.log("makeLabelGradiant called=======");
    var startColor = cc.WHITE;
    var endColor = cc.WHITE;
    switch (enumColorType){
        case 1:
            startColor = cc.c3b(255/255,153/255,18/255);
            endColor = cc.c3b(255/255,255/255,255/255);
            break;
        case 2:
            break;

    }
    //投影
    if(label.shadow){
        label.shadow.removeFromParent();
    }
    var shadowLabel = label.copyNode();
    shadowLabel.setColor(cc.c3b(138,0,0));
    shadowLabel.setPosition(label.getPositionX()+3,label.getPositionY()-2);
    var labelZorder = label.getZOrder();
    label.setZOrder(labelZorder+1);
    label.getParent().addChild(shadowLabel,labelZorder);
    label.shadow = shadowLabel;

    //重写setVisible
    var oldVisibleFunc = cc.LabelTTF.prototype.setVisible;
    label.setVisible = function (visible) {
        oldVisibleFunc.call(label,visible);
        oldVisibleFunc.call(label.shadow,visible);
    }

    var visibleOrigin = cc.Director.getInstance().getVisibleOrigin() ;
    var visibleSize =cc.Director.getInstance().getVisibleSize();
    var screanPixls = cc.Director.getInstance().getWinSizeInPixels();

    var labelStartX = (label.convertToWorldSpace(cc.p(0,0)).x - visibleOrigin.x)  ;
    var labelStartY = (label.convertToWorldSpace(cc.p(0,0)).y - visibleOrigin.y )  ;
    //根据视口大小获取label大小
    var labelWidth =  label.getContentSize().width * label.getScaleX() ;
    var labelHeight = label.getContentSize().height * label.getScaleY() ;

    var sh;

    sh = global.shader_manager.getshader("labelGradiant");
    sh = ui_utils.getIndependentShader(sh.obj);

    var setUniforms = function(labelSh){
          var start_x_location = sh.getUniformLocationForName("start_x");
          labelSh.setUniformLocationWith1f(start_x_location,labelStartX);

          var start_y_location = sh.getUniformLocationForName("start_y");
          labelSh.setUniformLocationWith1f(start_y_location,labelStartY);

          var label_height_location = sh.getUniformLocationForName("label_height");
          labelSh.setUniformLocationWith1f(label_height_location,labelHeight);

          var label_width_location = sh.getUniformLocationForName("label_width");
          labelSh.setUniformLocationWith1f(label_width_location,labelWidth);

          var type_location = sh.getUniformLocationForName("type");
          labelSh.setUniformLocationWith1i(type_location,1);

          var startColor_location = sh.getUniformLocationForName("startColor");
          labelSh.setUniformLocationWith4f(startColor_location,startColor.r,startColor.g,startColor.b,1.0);

          var endColorr_location = sh.getUniformLocationForName("endColor");
          labelSh.setUniformLocationWith4f(endColorr_location,endColor.r,endColor.g,endColor.b,1.0);
    }
    setUniforms(sh);
    label.setShaderProgram(sh);


    label.updateShader = function(){

        console.log("updateShader === ")
        this.getShaderProgram().reset();
        ui_utils.makeLabelGradiant(this,enumColorType);
    }
    global.shader_manager.gradientLabels.push(label);

}

