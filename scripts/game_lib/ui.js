//notice that :
//although we use template node's parent as the new node parent, when add it , it insert to the children end,
//so it will cover other nodes which should cover the template node. 

//wrapper some ui useful interface

//-------- hide and show a node,and disable all touch event --------//
var not_visible_point = cc.p(50000, 50000);
var touch_node_tag = 11111;

exports.hideui = function (node) {
    node.setVisible(false);
    if (!node.___original_position) {
        node.___original_position = node.getPosition();
    }
    node.setPosition(not_visible_point);
}

exports.showui = function (node) {
    node.setVisible(true);
    if (node.___original_position) {
        node.setPosition(node.___original_position);
    }
}
//添加吞噬层
exports.add_tonchnode = function (node,size) 
{
    if (global.isNull(node) || node.getChildByTag(touch_node_tag))  return;
   var node_new = new cc.Layer();
   node_new.setTag(touch_node_tag);
   node_new.setTouchEnabled(true);

   var lv =  node.getLayerLv();
   node_new.refresh(lv + 10);

    //set node as a swallow one
  node_new.setTouchMode(1);//touch_node_tag
  node_new.setContentSize(size);

   node_new.onTouchBegan = function (touch) 
   {
      return true;
   }
   node.addChild(node_new);
}
//移除吞噬层
exports.remove_tonchnode = function (node) 
{
   if (!global.isNull(node) && global.fn.isValidNative(node) && (node instanceof cc.Node || node instanceof cc.Layer))
   {
        if (node.getChildByTag && node.getChildByTag(touch_node_tag))
        {
            if (node.removeChildByTag) 
            {
                node.removeChildByTag(touch_node_tag);
            }
        }
        
   }
}

//-------- wrapper ccbi reader ---------//
exports.loadui = function (ccbi, ower, proto_name) {

    //set ccbi resource path
    if (ccbi) {
        var index = ccbi.lastIndexOf("/") + 1;
        var path = ccbi.slice(0, index);

        cc.BuilderReader.setResourcePath(path);
    }
    
    if (proto_name == undefined) {
        proto_name = 'Node';
    }
    var obj = new cc[proto_name];

    ower.__proto__ = obj;
    //make js obj bind to native obj.
    __associateObjWithNative(ower, obj);

    //load ccbi
    var node;
    if (ccbi) {
        node = cc.BuilderReader.load(ccbi, ower);
    } else {
        node = cc.Node.create();
    }

    if (node) {

        console.log("load ccbi : " + ower.ccbi_name + " ok !");

        ower.addChild(node);
        
        // adapt screen
        global.screen_adapter.adaptUI(ower);
        // reset ttflabel
        global.screen_adapter.resetTTFLabel(ower, ccbi);
        return true;
    }

    console.log('load ccbi : ' + ccbi + ' failed !');
    return false;
};

//-------- wrapper self node ---------//
exports.load = function (node) {

    var obj = new cc.Node();

    node.__proto__ = obj;
    //make js obj bind to native obj.
    __associateObjWithNative(node, obj);

    return true;
}


//the same as loadui, except we are modal
// auto: callback when touch to close
// bg_name: the bg node name to check touch out
exports.loadmodalui = function (ccbi, ower, auto, bg_name) {

    //set ccbi resource path
    if (ccbi) {
        var index = ccbi.lastIndexOf("/") + 1;
        var path = ccbi.slice(0, index);

        cc.BuilderReader.setResourcePath(path);
    }

    var obj = new cc.Layer();

    //catch touch event
    obj.setTouchEnabled(true);

    //set node as a swallow one
    obj.setTouchMode(1);

    // forbid all other touch
    obj.onTouchBegan = function (touch) {

        if (ower.isVisible()) {

            //console.log("modal layer touch!!!");
            var ok = true;
            var bg = ower[bg_name];
            if (bg && bg instanceof cc.Node) {
                if (bg.getParent()) {
                    var bbox = bg.getBoundingBox();
                    var pos = bg.getParent().convertToNodeSpace(touch.getLocation());
                    ok = !cc.rectContainsPoint(bbox, pos);
                }
            }

            if (ok) {
                if (typeof auto === "function") {

                    var ret = auto(touch);
                    if (ret == undefined) {
                        ret = true;
                    }

                    return ret;
                } else if (auto === true) {
                    global.scene_manager.toLastStatus();
                } else if (typeof auto === 'string') {
                    global.scene_manager.changeStatus(auto);
                }
            }

            return true;
        }
        else {
            return false;
        }

    };

    ower.__proto__ = obj;
    //make js obj bind to native obj.
    __associateObjWithNative(ower, obj);

    //load ccbi
    var node;
    if (ccbi) {
        node = cc.BuilderReader.load(ccbi, ower);
    } else {
        node = cc.Node.create();
    }

    if (node) {

        console.log("load ccbi : " + ower.ccbi_name + " ok !");

        ower.addChild(node);

        //set modal
        ower.setModal(true);

        // adapt screen
        global.screen_adapter.adaptUI(ower, true);
        // reset ttflabel
        global.screen_adapter.resetTTFLabel(ower, ccbi);

        return true;
    }

    return false;
}

//--------- create a modal node,from a normal node ---------//
//layer_lv mean the root node level.
exports.createmodal = function (node, layer_lv, auto) {

    var old_parent = node.getParent();

    if (old_parent) {
        node.retain();
        node.removeFromParent(false);
    }

    var obj = new cc.Layer();

    //catch touch event
    obj.setTouchEnabled(true);

    //set node as a swallow one
    obj.setTouchMode(1);

    // forbid all other touch
    obj.onTouchBegan = function (touch) {

        if (obj.isVisible()) {
            console.log("modal layer touch!!!");

            if (typeof auto === "function") {
                var ret = auto(touch);
                if (ret == undefined) {
                    ret = true;
                }

                return ret;
            }
            else if (auto == true) {
                obj.setVisible(false);
            }

            return true;
        }
        else {
            return false;
        }

    };

    //overwrite the refresh
    obj.refresh = function (lv) {

        //set larger order to show at the top,just more than current root node
        obj.setZOrder(lv * cc.zorderBase + 1);

        //lv need top than current root node
        cc.Node.prototype.refresh.call(obj, lv + 1);
    }

    obj.refresh(layer_lv);

    obj.addChild(node);

    if (old_parent) {
        node.release();
        old_parent.addChild(obj);
    }

    return obj;
}

//-------- create brightness effect -------//
var brightness_time = 1;
exports.create_brightness = function (node) {

    var brightness_node = node._brightness_node;

    var ctor = node.constructor;
    if (ctor == cc.Sprite) {

        if (brightness_node) {
            brightness_node.setDisplayFrame(node.displayFrame());
        }
        else {
            brightness_node = cc.Sprite.createWithSpriteFrame(node.displayFrame());
        }
    }
    else if (ctor == cc.LabelTTF) {

        if (brightness_node) {
            brightness_node.setString(node.getString());
        }
        else {
            brightness_node = cc.LabelTTF.create(node.getString(), node.getFontName(), node.getFontSize());
        }
    }
    else if (ctor == cc.LabelBMFont) {

        if (brightness_node) {
            brightness_node.setString(node.getString());
        }
        else {
            brightness_node = cc.LabelBMFont.create(node.getString(), node.getFntFile());
        }
    }
    else {
        console.log("create_brightness not support this type of node : " + ctor);

        return;
    }

    //check is new
    if (!node._brightness_node) {

        //console.log("%%%%%%%%%%%%%%");

        node._brightness_node = brightness_node;

        brightness_node.setPosition(node.getPosition());
        brightness_node.setAnchorPoint(node.getAnchorPoint());
        brightness_node.setScaleX(node.getScaleX());
        brightness_node.setScaleY(node.getScaleY());
        brightness_node.setRotation(node.getRotation());

        brightness_node.setColor(cc.c3b(50, 100, 100));
        brightness_node.setShaderProgram(global.shader_manager.getshader("brightness"));

        node.getParent().addChild(brightness_node);

        //run action
        brightness_node.setOpacity(0);
        brightness_node.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(brightness_time), cc.FadeOut.create(brightness_time))));

    }
}

//-------- wrapper EditBox ui  ---------//
exports.createEditBox = function (scale9S) {

    if (scale9S instanceof cc.Scale9Sprite) {
        var Edit = new cc.EditBox;

        Edit.__proto__.__proto__ = cc.ControlButton.prototype;

        var pos = scale9S.getPosition();

        //remove from parent first
        var _parent = scale9S.getParent();
        if (_parent) {
            scale9S.retain();
            scale9S.removeFromParent(false);
        }

        //EditBox use menu priority
        Edit.setTouchPriority(cc.touchPriorityBase + cc.touchPriorityMenu);

        Edit.initWithSizeAndBackgroundSprite(scale9S.getContentSize(), scale9S);
        Edit.setZoomOnTouchDown(false);
        
        if (_parent) {
            scale9S.release();
            _parent.addChild(Edit);

            //set position only when addChild
            Edit.setPosition(pos);
        }	
		
        return Edit;
    }
    else {
        console.log("error : createEditBox need a Scale9Sprite");
    }
}

//-------- wrapper WebView ui  ---------//
//webview has a function : request(url,[bcache(default : true)])
exports.createWebView = function (scale9S, edgeWidth, edgeHeight) {

    if (scale9S instanceof cc.Scale9Sprite) {

        var pos = scale9S.getPosition();

        //remove from parent first
        var _parent = scale9S.getParent();
        if (_parent) {
            scale9S.retain();
            scale9S.removeFromParent(false);
        }

        var size = scale9S.getContentSize();

        edgeHeight = edgeHeight || 20;
        edgeWidth = edgeWidth || 20;
        webview = cc.WebView.create(cc.size(size.width - edgeWidth, size.height - edgeHeight), scale9S);

        if (_parent) {
            scale9S.release();
            _parent.addChild(webview);
        }

        //must call this after addChild
        //scale9S use AnchorPoint (0.5,0.5), but webview use (0,0)
        webview.setPosition(cc.p(pos.x - size.width / 2, pos.y -  size.height / 2));

        return webview;
    }
    else {
        console.log("error : createWebView need a Scale9Sprite");
    }
}

//-------- wrapper VideoView ui  ---------//
//videoview has functions : start(path,function finishcb(VideoView){})
//                        : stop()
exports.createVideoView = function (scale9S, edgeWidth, edgeHeight) {

    if (scale9S instanceof cc.Scale9Sprite) {

        var pos = scale9S.getPosition();

        //remove from parent first
        var _parent = scale9S.getParent();
        if (_parent) {
            scale9S.retain();
            scale9S.removeFromParent(false);
        }

        var size = scale9S.getContentSize();

        edgeHeight = edgeHeight || 20;
        edgeWidth = edgeWidth || 20;
        videoview = cc.VideoView.create(cc.size(size.width - edgeWidth, size.height - edgeHeight), scale9S);

        if (_parent) {
            scale9S.release();
            _parent.addChild(videoview);
        }

        //must call this after addChild
        //scale9S use AnchorPoint (0.5,0.5), but videoview use (0,0)
        videoview.setPosition(cc.p(pos.x - size.width / 2, pos.y -  size.height / 2));

        return videoview;
    }
    else {
        console.log("error : createVideoView need a Scale9Sprite");
    }
}

//-------- wrapper tableview ui  ---------//
function tableview_factory(node, tmp_name, direction) {

    this.m_node = node;
    this.m_tmpname = tmp_name;
    this.m_direction = direction || cc.ScrollViewDirectionHorizontal;
    
    //hide tmp node
    this.m_node[this.m_tmpname].setVisible(false);

    this.m_tableview = null;
}

//dummy callback
tableview_factory.dummy_callback = function () {
    console.log("call dummy callback");
}

//notice that :  you should call setContentOffsetIndex to some index after finish create.
//create a new tableview
//this can be add the "item_name"_clicked callback
tableview_factory.prototype.create = function (num, parent) {

    if (this.m_tableview) {
        this.m_tableview.removeFromParent();
        this.m_tableview = null;
    }

    var priority_base = this.m_node.getLayerLv() * cc.touchPriorityBase;
    var tmp_node = this.m_node[this.m_tmpname];

    this.m_tableview = cc.TableView.create(tmp_node.getContentSize(), num, tmp_node.getContentSize(), this.m_direction, true);

    //may be need convert the position to parent
    this.m_tableview.setPosition(tmp_node.getPosition());
    this.m_tableview.setAnchorPoint(tmp_node.getAnchorPoint());

    this.m_createcb = tableview_factory.dummy_callback;
    var self = this;
    this.m_tableview.setCellCreateCallback(function (viewer, index) {

        var _node = cc.Node.create();

        var children = tmp_node.getChildren();
        for (var i = 0; i < children.length; i++) {

            _node.addChild(children[i].copyNode(self, _node, priority_base, index));
        }

        self.m_createcb(viewer, index, _node);

        return _node;
    });

    //overwrite setCellCreateCallback
    this.m_tableview.setCellCreateCallback = function (cb) {
        self.m_createcb = (typeof cb === "function") ? cb : tableview_factory.dummy_callback;
    }

    this.m_tableview.setTouchPriority(priority_base + cc.touchPriorityScrollview);

    parent = parent || tmp_node.getParent();
    parent.addChild(this.m_tableview);

    var off_index = 0;
    this.m_tableview.setContentOffsetIndex = function (index, sync) {
        if (sync) {
            cc.TableView.prototype.setContentOffsetIndex.call(self.m_tableview, index);
            off_index = -1;
        }
        else {
            off_index = index;
        }
    }

    //delay to nextTick
    global.nextTick(function () {
        delete self.m_tableview.setContentOffsetIndex;

        if (off_index != -1) {
            self.m_tableview.setContentOffsetIndex(off_index);
        }
    });

    return this.m_tableview;
}
exports.tableview_factory = tableview_factory;

//-------- wrapper scrollview ui  ---------//
//create a new scrollview
//this can be add the "item_name"_clicked callback
//this can be add the initScrollViewItem callback
function scrollview_factory(node, tmp_name, reverse, direction) {
    this.m_node = node;

    this.m_reverse = !!reverse;
    this.m_direction = direction;

    var children = node[tmp_name].getChildren();
    //store init scrollview parameters
    this.m_viewsize = node[tmp_name].getContentSize();
    this.m_pos = node[tmp_name].getPosition();
    this.m_ap = node[tmp_name].getAnchorPoint();

    this.m_parent_node = node[tmp_name].getParent();


    // another direction total num
    //this.m_another_num;

    // x,y space
    //this.m_sx;
    //this.m_sy;

    // x,y base to edge
    //this.m_basex;
    //this.m_basey; 

    var begin_pos;
    //note that --- ccbi direction must like this :
    //x from left to right , y from top to bottom.
    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        //we use node to get position
        if (child.constructor == cc.Node) {

            //we need the ccbi original position
            var pos = child.getPosition();
            pos = cc.p.counter_resolution(pos.x, pos.y);

            if (begin_pos == undefined) {
                begin_pos = pos;

                //get x,y base to edge
                this.m_basex = begin_pos.x;
                this.m_basey = this.m_viewsize.height - begin_pos.y;

                //the template node must be the first node child
                this.m_tmpnodes = child.getChildren();

                this.m_tmpnode = child;
            }
            else {

                //check direction
                var dx = pos.x - begin_pos.x;
                var dy = begin_pos.y - pos.y;
                
                if (dx > dy) {

                    if (this.m_direction == undefined) {

                        this.m_direction = cc.ScrollViewDirectionHorizontal;
                        this.m_sx = dx;
                        this.m_sy = 0;
                        this.m_another_num = 1;
                    }
                    else if (this.m_direction == cc.ScrollViewDirectionVertical) {

                        //like this:
                        // xy1   x2
                        // y2
                        // ...

                        this.m_direction = cc.ScrollViewDirectionHorizontal;

                        this.m_sx = dx;

                        //use y to get the vertical num, need sub the two edge space
                        this.m_another_num = ~ ~((this.m_viewsize.height - (this.m_basey << 1)) / this.m_sy) + 1;

                        break;
                    }
                    else {

                        //like this:   
                        // x1 x2 ... xN

                    }

                
                }
                else {

                    if (this.m_direction == undefined) {

                        this.m_direction = cc.ScrollViewDirectionVertical;
                        this.m_sy = dy;
                        this.m_sx = 0;
                        this.m_another_num = 1;
                    }
                    else if (this.m_direction == cc.ScrollViewDirectionHorizontal) {

                        //like this:
                        // yx1 x2 ...
                        // y2

                        this.m_direction = cc.ScrollViewDirectionVertical;

                        this.m_sy = dy;

                        //use x to get the horizontal num, need sub the two edge space
                        this.m_another_num = ~ ~((this.m_viewsize.width - (this.m_basex << 1)) / this.m_sx) + 1;

                        break;
                    }
                    else {

                        //like this:
                        // y1
                        // y2
                        // ...
                        // yN

                    }

                
                }
            }
        }
    }

    if (this.m_direction == undefined) {

        console.log("err : scrollview need at least two nodes to check direction!!!");
    }

    //hide tmp node
    node[tmp_name].setVisible(false);
}

scrollview_factory.prototype.get_element = function (idx) {
    if (this.m_scrollview && this.m_scrollview.elements) {
        return this.m_scrollview.elements[idx];
    }
}

scrollview_factory.prototype.setVisible = function (value) {
    if (this.m_scrollview) {
        this.m_scrollview.setVisible(value);
    }    
}

scrollview_factory.prototype.getScrollView = function () {
    return this.m_scrollview;
}

scrollview_factory.prototype.getContainer = function () {
    if (this.m_scrollview) {
        return this.m_scrollview.container;
    }    
}

scrollview_factory.prototype.have_more_elements = function () {

    if (this.m_scrollview) {

        var contentsize = this.m_scrollview.getContentSize();
        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
            return contentsize.width > this.m_viewsize.width;
        }
        else {
            return contentsize.height > this.m_viewsize.height;
        }
    }
    return false;
}

scrollview_factory.prototype.is_toporleft = function () {

    if (this.m_scrollview) {

        var pos = this.m_scrollview.container.getPosition();

        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
            return pos.x >= this.m_scrollview.maxContainerOffset().x;
        }
        else {
            return pos.y <= this.m_scrollview.minContainerOffset().y;
        }
    }

    return false;
}

scrollview_factory.prototype.is_bottomorright = function () {

    if (this.m_scrollview) {

        var pos = this.m_scrollview.container.getPosition();

        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
            return pos.x <= this.m_scrollview.minContainerOffset().x;
        }
        else {
            return pos.y >= this.m_scrollview.maxContainerOffset().y;
        }
    }

    return false;
}

scrollview_factory.prototype.move_to = function (position, distance) {

    if (this.m_scrollview) {

        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {

            var x = -position.x + distance;
            var minx = this.m_scrollview.minContainerOffset().x;
            var maxx = this.m_scrollview.maxContainerOffset().x;
            x = Math.max(minx, Math.min(maxx, x));

            this.m_scrollview.setContentOffset(cc.p(x, 0));
        }
        else {
            var y = -position.y + distance;
            var miny = this.m_scrollview.minContainerOffset().y;
            var maxy = this.m_scrollview.maxContainerOffset().y;
            y = Math.max(miny, Math.min(maxy, y));

            this.m_scrollview.setContentOffset(cc.p(0, y));
        }
    }
}
/**
 * 在当前的基础上，滑动一段距离
 * created by cgz
 * @param distance
 */
scrollview_factory.prototype.move_by = function(distance){
    if (this.m_scrollview) {

        var curOffSet = this.m_scrollview.getContentOffset();
        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {

            var x = curOffSet.x + distance;
            var minx = this.m_scrollview.minContainerOffset().x;
            var maxx = this.m_scrollview.maxContainerOffset().x;
            x = Math.max(minx, Math.min(maxx, x));

            this.m_scrollview.setContentOffset(cc.p(x, 0));
        }
        else {
            var y = curOffSet.y + distance;
            var miny = this.m_scrollview.minContainerOffset().y;
            var maxy = this.m_scrollview.maxContainerOffset().y;
            y = Math.max(miny, Math.min(maxy, y));

            this.m_scrollview.setContentOffset(cc.p(0, y));
        }
    }
}

scrollview_factory.prototype.auto_move_to = function (distance, delay) {

    if (this.m_scrollview) {

        var pos;
        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
            pos = cc.p(-distance, 0);
        }
        else {
            pos = cc.p(0,-distance);
        }

        var self = this;

        var act = cc.Sequence.create(cc.DelayTime.create(delay), cc.MoveTo.create(0.1, pos));
        var act2 = cc.Sequence.create(act, cc.CallFunc.create(function () {

            self.m_scrollview.container.setPosition(pos);
        }));

        this.m_scrollview.container.runAction(act2);
    }
}

scrollview_factory.prototype.create = function (num,sync) {

    //check have direction
    if (this.m_direction == undefined) {

        return null;
    }

    //remove the last one
    if (this.m_scrollview) {
        this.m_scrollview.removeFromParent();
        this.m_scrollview = null;
    }

    //create scrollview
    var container = cc.Node.create();

    this.m_scrollview = cc.ScrollView.create(this.m_viewsize, container);
    //store container
    this.m_scrollview.container = container;
    //store elements
    this.m_scrollview.elements = {};

    //init scrollview
    this.m_scrollview.setAnchorPoint(this.m_ap);
    this.m_scrollview.setPosition(this.m_pos);
    this.m_scrollview.setDirection(this.m_direction);

    this.m_parent_node.addChild(this.m_scrollview);

    //set touch
    var priority_base = this.m_node.getLayerLv() * cc.touchPriorityBase;
    this.m_scrollview.setTouchPriority(priority_base + cc.touchPriorityScrollview);

    var total_dir_line = ~ ~((num - 1) / this.m_another_num) + 1;

    var need_fix = false;

    //we use ccbi original pos for contentSize
    if (this.m_direction == cc.ScrollViewDirectionHorizontal) {

        //need add the left right edge base space
        var dir_length = this.m_basex + ~ ~((num - 1) / this.m_another_num) * this.m_sx + this.m_basex;

        //notice : horizontal we use left to right ,mean max to min , so min should not more than max when dir_length is less than width
        //the another direction need ccbi to handle the edge space ,we just use the view size
        this.m_scrollview.setContentSize(cc.size(dir_length < this.m_viewsize.width ? this.m_viewsize.width : dir_length, this.m_viewsize.height));

        //we need fix position
        if (dir_length < this.m_viewsize.width && this.m_reverse) {

            need_fix = true;
        }

        //show left first
        this.m_scrollview.setContentOffset(this.m_scrollview.maxContainerOffset());
    }
    else {

        //need add the top bottom edge base space
        var dir_length = this.m_basey + ~ ~((num - 1) / this.m_another_num) * this.m_sy + this.m_basey;

        //notice : vertical we use top to bottom ,mean min to max , so we should use dir_length directly 
        //the another direction need ccbi to handle the edge space ,we just use the view size
        this.m_scrollview.setContentSize(cc.size(this.m_viewsize.width, dir_length < this.m_viewsize.height ? this.m_viewsize.height : dir_length));

        //we need fix position
        if (dir_length < this.m_viewsize.height && !this.m_reverse) {

            need_fix = true;
        }

        //show top first
        this.m_scrollview.setContentOffset(this.m_scrollview.minContainerOffset());
    }
    
    var tmp_size = this.m_tmpnode.getContentSize();
    var tmp_ap = this.m_tmpnode.getAnchorPoint();
    var tmp_scale = this.m_tmpnode.getScale();

    //create container elements
    for (var index = 0; index < num; index++) {

        var element = cc.Node.create();
        // by adfan: set prop from template
        element.setContentSize(tmp_size);
        element.setAnchorPoint(tmp_ap);
        element.setScale(tmp_scale);

        for (var i = 0; i < this.m_tmpnodes.length; i++) {
            element.addChild(this.m_tmpnodes[i].copyNode(this, element, priority_base, index, sync));
        }

        container.addChild(element);

        this.m_scrollview.elements[index] = element;

        if (typeof this.initScrollViewItem === "function") {
            this.initScrollViewItem(index, element);
        }

        var dir_line = ~ ~(index / this.m_another_num);
        var another_line = index % this.m_another_num;

        var x, y;
        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {

            //ccbi x from left to right
            if (need_fix) {
                x = (this.m_viewsize.width - this.m_basex) - dir_line * this.m_sx;
            }
            else {
                x = this.m_basex + (this.m_reverse ? (total_dir_line - 1 - dir_line) : dir_line) * this.m_sx;
            }

            y = this.m_basey + another_line * this.m_sy;
        }
        else {

            //ccbi y from top to bottom.
            if (need_fix) {
                y = (this.m_viewsize.height - this.m_basey) - dir_line * this.m_sy;
            }
            else {
                y = this.m_basey + (this.m_reverse ? dir_line : (total_dir_line - 1 - dir_line)) * this.m_sy;
            }

            x = this.m_basex + another_line * this.m_sx;

        }

        //position need be resolution
        element.setPosition(cc.p.resolution(x, y));
    }

    return this.m_scrollview;
}
exports.old_scrollview_factory = scrollview_factory;

//-------- for new scrollview : use tableview ---------//
newscrollview_factory.prototype.__proto__ = scrollview_factory.prototype;

function newscrollview_factory(node, tmp_name, reverse, direction) {
    //call parent contractor
    scrollview_factory.call(this, node, tmp_name, reverse, direction);

    //store the total create num
    this.m_create_num = -1;
}

//return the element pos relative to container,this can be call when element is not create yet
newscrollview_factory.prototype.get_element_pos = function (idx) {
    if (this.m_create_num === -1) {
        console.log("you should call get_element_pos after create");
        return;
    }
    //convert idx to cell index
    var index = ~ ~(idx / this.m_another_num);

    //check is valid
    if (index < this.m_create_num) {

        var pos = this.m_scrollview.getCellPosition(index);
        var i = idx % this.m_another_num;

        if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
            pos.x += this.m_sx / 2;
            pos.y += this.m_basey + (this.m_another_num - 1 - i) * this.m_sy;
        }
        else {
            pos.x += this.m_basex + i * this.m_sx;
            pos.y += this.m_sy / 2;
        }

        return pos;
    }
}

//return the tableview cell node,which is the direct child of container
newscrollview_factory.prototype.get_element_node = function (idx) {
    if (this.m_scrollview && this.m_scrollview.elements) {
        var element = this.m_scrollview.elements[idx];
        if (element) {
            return element.getParent().getParent();
        }
    }
}

//add offset for element
newscrollview_factory.prototype.add_element_offset = function (idx, offset) {

    if (this.m_create_num === -1) {
        console.log("you should call add_element_offset after create");
    }
    else {
        //convert idx to cell index
        idx = ~ ~(idx / this.m_another_num);
        
        //check is valid, idx = m_create_num mean at the end
        if (idx <= this.m_create_num && offset > 0) {

            this.m_scrollview.setCellOffset(idx, offset);
        }
    }
}

newscrollview_factory.prototype.create = function (num, sync) {

    //check have direction
    if (this.m_direction == undefined) {

        return null;
    }

    var old_view = this.m_scrollview;
    this.m_scrollview = null;
    if (!sync) {
        //remove the last one.
        if (old_view) {
            old_view.removeFromParent();
            old_view = null;
        }
    }

    //create scrollview
    var total_dir_line = ~ ~((num - 1) / this.m_another_num) + 1;

    this.m_create_num = total_dir_line;

    var size;
    var head_offset;
    if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
        size = cc.size(this.m_sx, this.m_viewsize.height);
        head_offset = this.m_basex - this.m_sx / 2;
    }
    else {
        size = cc.size(this.m_viewsize.width, this.m_sy);
        head_offset = this.m_basey - this.m_sy / 2;
    }

    this.m_scrollview = cc.TableView.create(size, total_dir_line, this.m_viewsize, this.m_direction, false);


    this.m_scrollview.setReverse(this.m_reverse);
    //we need add head offset
    this.add_element_offset(0, head_offset);
    //store container
    this.m_scrollview.container = this.m_scrollview.getContainer();
    //store elements
    this.m_scrollview.elements = {};

    //init scrollview
    this.m_scrollview.setAnchorPoint(this.m_ap);
    this.m_scrollview.setPosition(this.m_pos);

    this.m_parent_node.addChild(this.m_scrollview);

    //set touch
    var priority_base = this.m_node.getLayerLv() * cc.touchPriorityBase;
    this.m_scrollview.setTouchPriority(priority_base + cc.touchPriorityScrollview);

    var offset;
    this.m_scrollview.setContentOffset = function (off) {
        offset = off;
    }

    //avoid render something in current tick
    this.m_scrollview.container.setVisible(false);

    var self = this;

    //delay to nextTick
    global.nextTick(function () {
        delete self.m_scrollview.setContentOffset;

        if (offset === undefined) {
            if (self.m_direction == cc.ScrollViewDirectionHorizontal) {
                offset = self.m_reverse ? self.m_scrollview.minContainerOffset() : self.m_scrollview.maxContainerOffset();
            }
            else {
                offset = self.m_reverse ? self.m_scrollview.maxContainerOffset() : self.m_scrollview.minContainerOffset();
            }
        }

        //remove the last one when new one visible.
        if (sync && old_view) {
            old_view.removeFromParent();
        }

        self.m_scrollview.setContentOffset(offset);
        self.m_scrollview.container.setVisible(true);
    });

    var tmp_size = this.m_tmpnode.getContentSize();
    var tmp_ap = this.m_tmpnode.getAnchorPoint();
    var tmp_scale = this.m_tmpnode.getScale();

    this.m_scrollview.setCellCreateCallback(function (viewer, index) {

        var _node = cc.Node.create();

        var id_base = index * self.m_another_num;
        var total = num - id_base;
        if (total > self.m_another_num) {
            total = self.m_another_num;
        }

        for (var i = 0; i < total; i++) {
            var element = cc.Node.create();
            // by adfan: set prop from template
            element.setContentSize(tmp_size);
            element.setAnchorPoint(tmp_ap);
            element.setScale(tmp_scale);

            var id = id_base + i;

            for (var k = 0; k < self.m_tmpnodes.length; k++) {
                element.addChild(self.m_tmpnodes[k].copyNode(self, element, priority_base, id, sync));
            }

            if (self.m_direction == cc.ScrollViewDirectionHorizontal) {
                element.setPosition(cc.p(self.m_sx / 2, self.m_basey + (self.m_another_num - 1 - i) * self.m_sy));
            }
            else {
                element.setPosition(cc.p(self.m_basex + i * self.m_sx, self.m_sy / 2));
            }

            _node.addChild(element);

            self.m_scrollview.elements[id] = element;

            //do init at end
            if (typeof self.initScrollViewItem === "function") {
                self.initScrollViewItem(id, element);
            }
        }

        return _node;
    });

    return this.m_scrollview;
}
exports.scrollview_factory = newscrollview_factory;

//-------- wrapper table scrollview ui  ---------//

//inherit from scrollview_factory
tablescrollview_factory.prototype.__proto__ = scrollview_factory.prototype;

function tablescrollview_factory(node, tmp_name, reverse) {

    //call parent contractor
    scrollview_factory.call(this, node, tmp_name, reverse);

    //get table direction
    if (this.m_direction == cc.ScrollViewDirectionHorizontal) {
        this.m_tabdirection = cc.ScrollViewDirectionVertical;
    }
    else if (this.m_direction == cc.ScrollViewDirectionVertical) {
        this.m_tabdirection = cc.ScrollViewDirectionHorizontal;
    }
}

//other scrollview fn is not support by tablescrollview_factory , maybe need do in future
for (var key in scrollview_factory.prototype) {

    tablescrollview_factory.prototype[key] = function () {
        console.log("function is not support by tablescrollview_factory.");
    }
}

//this can be add the "item_name"_clicked callback
//this can be add the initScrollViewItem callback,and it can return a offset for next item.
//this can be add the scrollViewChanged(index,scrollview)

//--- may be not need now ---//
/* this can be add the scrollViewTouched(scrollview) */

//the return tablescrollview.scrollview_list : the scrollview list

//num : total num
//line_num : line num per page

//this is be modified,so need test when use
tablescrollview_factory.prototype.create = function (num, line_num) {

    //check have direction
    if (this.m_tabdirection == undefined) {

        return null;
    }

    if (!line_num) {
        line_num = tablescrollview_factory.default_line_num;
    }
    else {
        if (line_num > tablescrollview_factory.max_line_num) {

            console.log("warning tablescrollview line num more than max : " + tablescrollview_factory.max_line_num);
            line_num = tablescrollview_factory.max_line_num;
        }
    }


    //remove the last one
    if (this.m_tablescrollview) {
        this.m_tablescrollview.removeFromParent();
        this.m_tablescrollview = null;
    }

    //create table scrollview
    //get the page num
    var page_num = line_num * this.m_another_num;
    var pages = ~ ~((num - 1) / page_num) + 1;

    this.m_tablescrollview = cc.TableView.create(this.m_viewsize, pages, this.m_viewsize, this.m_tabdirection, true);


    //init table scrollview
    this.m_tablescrollview.setAnchorPoint(this.m_ap);
    this.m_tablescrollview.setPosition(this.m_pos);

    this.m_parent_node.addChild(this.m_tablescrollview);

    //set touch
    var priority_base = this.m_node.getLayerLv() * cc.touchPriorityBase;
    var touch_priority = priority_base + cc.touchPriorityScrollview;
    this.m_tablescrollview.setTouchPriority(touch_priority);

    //store all scrollview
    this.m_tablescrollview.scrollview_list = new Array(pages);

    //set callback
    var self = this;

    this.m_tablescrollview.setCellCreateCallback(function (viewer, node_index) {

        //create scrollview
        var index_num = num - node_index * page_num;
        index_num = index_num > page_num ? page_num : index_num;
        var index_offset = node_index * page_num;

        var total_dir_line = ~ ~((index_num - 1) / self.m_another_num) + 1;

        var size;
        if (self.m_direction == cc.ScrollViewDirectionHorizontal) {
            size = cc.size(self.m_sx, self.m_viewsize.height);
        }
        else {
            size = cc.size(self.m_viewsize.width, self.m_sy);
        }

        var scrollview = cc.TableView.create(size, total_dir_line, self.m_viewsize, self.m_direction, false);

        scrollview.setReverse(self.m_reverse);

        //store container
        scrollview.container = scrollview.getContainer();

        //init scrollview
        scrollview.setAnchorPoint(cc.p(0, 0));

        //set touch
        scrollview.setTouchPriority(touch_priority);

        var offset;
        scrollview.setContentOffset = function (off) {
            offset = off;
        }

        //delay to nextTick
        global.nextTick(function () {
            delete scrollview.setContentOffset;

            if (offset === undefined) {
                if (self.m_direction == cc.ScrollViewDirectionHorizontal) {
                    offset = self.m_reverse ? scrollview.minContainerOffset() : scrollview.maxContainerOffset();
                }
                else {
                    offset = self.m_reverse ? scrollview.maxContainerOffset() : scrollview.minContainerOffset();
                }
            }

            scrollview.setContentOffset(offset);
        });

        scrollview.setCellCreateCallback(function (viewer, index) {

            var _node = cc.Node.create();
            var id_base = index * self.m_another_num;
            var total = index_num - id_base;
            if (total > self.m_another_num) {
                total = self.m_another_num;
            }

            for (var i = 0; i < total; i++) {
                var element = cc.Node.create();
                var id = id_base + i + index_offset;

                for (var k = 0; k < self.m_tmpnodes.length; k++) {
                    element.addChild(self.m_tmpnodes[k].copyNode(self, element, priority_base, id));
                }

                if (typeof self.initScrollViewItem === "function") {
                    self.initScrollViewItem(id, element);
                }

                if (self.m_direction == cc.ScrollViewDirectionHorizontal) {
                    element.setPosition(cc.p(self.m_sx / 2, self.m_basey + (total - 1 - i) * self.m_sy));
                }
                else {
                    element.setPosition(cc.p(self.m_basex + i * self.m_sx, self.m_sy / 2));
                }

                _node.addChild(element);
            }

            return _node;
        });

        self.m_tablescrollview.scrollview_list[node_index] = scrollview;

        return scrollview;
    });

    this.m_tablescrollview.setCellChangedCallback(function (viewer, node_index) {
        if (typeof self.scrollViewChanged === "function") {
            self.scrollViewChanged(node_index, self.m_tablescrollview.scrollview_list[node_index]);
        }
    });

    //this may be not need now
    /*
    this.m_tablescrollview.setCellTouchedCallback(function (viewer, node) {
    if (typeof self.scrollViewTouched === "function") {
    self.scrollViewTouched(node);
    }
    });
    */

    //overwrite all callbacks, which is disable
    this.m_tablescrollview.setCellCreateCallback = function () {
        console.log("you do not need call setCellCreateCallback !");
    }
    this.m_tablescrollview.setCellChangedCallback = function () {
        console.log("you do not need call setCellChangedCallback !");
    }
    this.m_tablescrollview.setCellTouchedCallback = function () {
        console.log("you do not need call setCellTouchedCallback !");
    }

    var off_index = 0;
    this.m_tablescrollview.setContentOffsetIndex = function (index) {
        off_index = index;
    }

    //delay to nextTick
    global.nextTick(function () {
        delete self.m_tablescrollview.setContentOffsetIndex;

        self.m_tablescrollview.setContentOffsetIndex(off_index);
    });

    return this.m_tablescrollview;
}

tablescrollview_factory.default_line_num = 20;
tablescrollview_factory.max_line_num = 30;


exports.tablescrollview_factory = tablescrollview_factory;

