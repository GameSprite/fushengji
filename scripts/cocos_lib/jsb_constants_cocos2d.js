//
// cocos2d constants
//
cc.DIRECTOR_PROJECTION_2D = 0;
cc.DIRECTOR_PROJECTION_3D = 1;

cc.TEXTURE_PIXELFORMAT_RGBA8888 = 0;
cc.TEXTURE_PIXELFORMAT_RGB888 = 1;
cc.TEXTURE_PIXELFORMAT_RGB565 = 2;
cc.TEXTURE_PIXELFORMAT_A8 = 3;
cc.TEXTURE_PIXELFORMAT_I8 = 4;
cc.TEXTURE_PIXELFORMAT_AI88 = 5;
cc.TEXTURE_PIXELFORMAT_RGBA4444 = 6;
cc.TEXTURE_PIXELFORMAT_RGB5A1 = 7;
cc.TEXTURE_PIXELFORMAT_PVRTC4 = 8;
cc.TEXTURE_PIXELFORMAT_PVRTC4 = 9;
cc.TEXTURE_PIXELFORMAT_DEFAULT = cc.TEXTURE_PIXELFORMAT_RGBA8888;

cc.TEXT_ALIGNMENT_LEFT  = 0;
cc.TEXT_ALIGNMENT_CENTER = 1;
cc.TEXT_ALIGNMENT_RIGHT = 2;

cc.VERTICAL_TEXT_ALIGNMENT_TOP = 0;
cc.VERTICAL_TEXT_ALIGNMENT_CENTER = 1;
cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM = 2;

cc.IMAGE_FORMAT_JPEG = 0;
cc.IMAGE_FORMAT_PNG = 0;

cc.PROGRESS_TIMER_TYPE_RADIAL = 0;
cc.PROGRESS_TIMER_TYPE_BAR = 1;

cc.PARTICLE_TYPE_FREE = 0;
cc.PARTICLE_TYPE_RELATIVE = 1;
cc.PARTICLE_TYPE_GROUPED = 2;
cc.PARTICLE_DURATION_INFINITY = -1;
cc.PARTICLE_MODE_GRAVITY = 0;
cc.PARTICLE_MODE_RADIUS = 1;
cc.PARTICLE_START_SIZE_EQUAL_TO_END_SIZE = -1;
cc.PARTICLE_START_RADIUS_EQUAL_TO_END_RADIUS = -1;

cc.TOUCH_ALL_AT_ONCE = 0;
cc.TOUCH_ONE_BY_ONE = 1;

cc.TMX_TILE_HORIZONTAL_FLAG = 0x80000000;
cc.TMX_TILE_VERTICAL_FLAG = 0x40000000;
cc.TMX_TILE_DIAGONAL_FLAG = 0x20000000;

cc.TRANSITION_ORIENTATION_LEFT_OVER = 0;
cc.TRANSITION_ORIENTATION_RIGHT_OVER = 1;
cc.TRANSITION_ORIENTATION_UP_OVER = 0;
cc.TRANSITION_ORIENTATION_DOWN_OVER = 1;

cc.RED = {r:255, g:0, b:0};
cc.GREEN = {r:0, g:255, b:0};
cc.BLUE = {r:0, g:0, b:255};
cc.BLACK = { r: 0, g: 0, b: 0 };
cc.WHITE = { r: 255, g: 255, b: 255 };
cc.MAGENTA = { r: 255, g: 0, b: 255 };
cc.ORANGE = { r: 255, g: 127, b: 0 };
cc.GRAY = { r: 166, g: 166, b: 166 };
cc.YELLOW = { r:255, g:255, b:0 };

cc.POINT_ZERO = {x:0, y:0};

// XXX: This definition is different than cocos2d-html5
cc.REPEAT_FOREVER = - 1;


cc.MENU_STATE_WAITING = 0;
cc.MENU_STATE_TRACKING_TOUCH = 1;
cc.MENU_HANDLER_PRIORITY = -128;
cc.DEFAULT_PADDING = 5;

//for scrollview direction
cc.ScrollViewDirectionNone           = -1;
cc.ScrollViewDirectionHorizontal     = 0 ;
cc.ScrollViewDirectionVertical       = 1 ;
cc.ScrollViewDirectionBoth           = 2 ;

//for controlbutton events
cc.CCControlEventTouchDown           = 1 << 0 ;    // A touch-down event in the control.
cc.CCControlEventTouchDragInside     = 1 << 1 ;    // An event where a finger is dragged inside the bounds of the control.
cc.CCControlEventTouchDragOutside    = 1 << 2 ;    // An event where a finger is dragged just outside the bounds of the control. 
cc.CCControlEventTouchDragEnter      = 1 << 3 ;    // An event where a finger is dragged into the bounds of the control.
cc.CCControlEventTouchDragExit       = 1 << 4 ;    // An event where a finger is dragged from within a control to outside its bounds.
cc.CCControlEventTouchUpInside       = 1 << 5 ;    // A touch-up event in the control where the finger is inside the bounds of the control. 
cc.CCControlEventTouchUpOutside      = 1 << 6 ;    // A touch-up event in the control where the finger is outside the bounds of the control.
cc.CCControlEventTouchCancel         = 1 << 7 ;    // A system event canceling the current touches for the control.
cc.CCControlEventValueChanged        = 1 << 8 ;    // A touch dragging or otherwise manipulating a control, causing it to emit a series of different values.

//for EditBox InputMode
cc.EditBoxInputModeAny = 0;                         //The user is allowed to enter any text, including line breaks.
cc.EditBoxInputModeEmailAddr = 1;                   //The user is allowed to enter an e-mail address.
cc.EditBoxInputModeNumeric = 2;                     //The user is allowed to enter an integer value.
cc.EditBoxInputModePhoneNumber = 3;                 //The user is allowed to enter a phone number.
cc.EditBoxInputModeUrl = 4;                         //The user is allowed to enter a URL.
cc.EditBoxInputModeDecimal = 5;                     //The user is allowed to enter a real number value. This extends EditBoxInputModeNumeric by allowing a decimal point.
cc.EditBoxInputModeSingleLine = 6;                  //The user is allowed to enter any text, except for line breaks.
cc.EditBoxInputModeNumeric =7;					// The user is allowed to enter a Number.
//for EditBox InputFlag
/**
 * Indicates that the text entered is confidential data that should be
 * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
 */
cc.EditBoxInputFlagPassword = 0;

/**
 * Indicates that the text entered is sensitive data that the
 * implementation must never store into a dictionary or table for use
 * in predictive, auto-completing, or other accelerated input schemes.
 * A credit card number is an example of sensitive data.
 */
cc.EditBoxInputFlagSensitive = 1;

/**
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each word should be capitalized.
 */
cc.EditBoxInputFlagInitialCapsWord = 2;

/**
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each sentence should be capitalized.
 */
cc.EditBoxInputFlagInitialCapsSentence = 3;

/**
 * Capitalize all characters automatically.
 */
cc.EditBoxInputFlagInitialCapsAllCharacters = 4;


// reusable objects
cc._reuse_p = [ {x:0, y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0} ];
cc._reuse_p_index = 0;
cc._reuse_size = {width:0, height:0};
cc._reuse_rect = {x:0, y:0, width:0, height:0};
cc._reuse_color3b = {r:255, g:255, b:255 };
cc._reuse_color4b = {r:255, g:255, b:255, a:255 };

//------------------------------- add multi modal support -------------------------//
//add touch priority
cc.touchPriorityBase = -128;
//all relative to base
cc.touchPriorityModalLayer = 129;                 //modal layer may have layer child,so we need set a lower priority
cc.touchPriorityLayer = 128;
cc.touchPriorityMenu = 0;
cc.touchPriorityScrollview = -1;
cc.touchPriorityMax = -2;

//add zorder
cc.zorderBase = 1000;

//some layer level
cc.layer_bottom = 1;                               //for bottom base layer
cc.layer_common = 100;                             //for some common use ( such as tips )
cc.layer_chat = cc.layer_common - 2;                  //for chat
cc.Layer_role_messgae = cc.layer_common - 1;          //for role message
cc.layer_loading = cc.layer_common + 5;            //for ui loading
cc.layer_top = cc.layer_common + 100;              //for top layer use
cc.layer_guide = cc.layer_top + 1;                 //for guide
cc.layer_touch = cc.layer_top + 5;                 //for global touch ui use
cc.layer_debug = cc.layer_top + 10;                //for debug layer use
cc.layer_frame = cc.layer_debug + 500;             //for frame

//extend cc.Node at here.

//node modal flag 
cc.Node.prototype.setModal = function (flag) {
    this._modal = flag;
}

cc.Node.prototype.isModal = function () {
    if (this._modal === undefined) {
        this._modal = false;
    }

    return this._modal;
}

//node layer level
cc.Node.prototype.setLayerLv = function (lv) {

    if (this.getLayerLv() != lv) {
        this._need_refresh = true;
    }
    this._layerlv = lv;
}

cc.Node.prototype.getLayerLv = function () {
    if (this._layerlv === undefined) {
        this._layerlv = cc.layer_bottom;
    }

    return this._layerlv;
}

//enter flag, control by ui manager
cc.Node.prototype.setEnter = function (flag) {
    this._enter_flag = flag;
}

cc.Node.prototype.isEnter = function () {
    if (this._enter_flag === undefined) {
        this._enter_flag = false;
    }

    return this._enter_flag;
}

//refresh node when enter,which will reset zorder and touch priority
cc.Node.prototype.refresh = function (lv) {

    //check is the root
    var root = false;
    if (lv === undefined) {

        //only modal ui need refresh
        if (this.isModal() && this._need_refresh) {

            this._need_refresh = false;

            lv = this.getLayerLv();

            //set zorder
            this.setZOrder(lv * cc.zorderBase);

            root = true;
        }
    }

    if (lv) {

        var lv_base = lv * cc.touchPriorityBase;

        if (this instanceof cc.ScrollView) {
            //console.log("reset_priority_scroll");
            this.setTouchPriority(lv_base + cc.touchPriorityScrollview);
        }
        else if (this instanceof cc.Menu) {
            //console.log("reset_priority_menu");
            this.setTouchPriority(lv_base + cc.touchPriorityMenu);
        }
        else if (this instanceof cc.EditBox) {
            //console.log("reset_priority_editbox");
            this.setTouchPriority(lv_base + cc.touchPriorityMenu);
        }
        else if (this instanceof cc.Layer) {
            //console.log("reset_priority_layer");
            
            if (root) {
                this.setTouchPriority(lv_base + cc.touchPriorityModalLayer);
            }
            else {
                this.setTouchPriority(lv_base + cc.touchPriorityLayer);            
            }

        }

        //EditBox in win32 , getChildren will cause problem (CCTextFieldTTF is not export)
        if (!(this instanceof cc.EditBox)) {

            var children = this.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].refresh(lv);
            }
        }
    }
}

//copy node with callback bind for create tableview and scrollview

//callback_root : menu callback bind node 
//mount_root : the node name bind node
//base_priority : touch priority 
//index : current node index
cc.Node.prototype.copyNode = function (callback_root, mount_root, base_priority, index, sync) {

    var mount_name = this.ownerName;

    var new_node;
    var have_child = false;
    if (this instanceof cc.LabelTTF) {
        new_node = cc.LabelTTF.create(
                        "",
                        this.getFontName(),
                        this.getFontSize(),
                        this.getDimensions(),
                        this.getHorizontalAlignment(),
                        this.getVerticalAlignment()
                      );
        new_node.setColor(this.getColor());
        new_node.setOpacity(this.getOpacity());

        //delay render it,since this will take some time.
        var str = this.getString();

        if (sync) {
            new_node.setString(str);
        }
        else {
            //overwrite the setString
            new_node.setString = function (new_str) {
                str = new_str;
            }

            global.nextTick(function () {
                if (new_node.hasOwnProperty('setString')) {
                    delete new_node.setString;

                    //just use the prototype function, the node may be delete yet
                    if (new_node.isValidNative()) {
                        new_node.setString(str);
                    }
                }
            });
        }
    }
    else if (this instanceof cc.LabelBMFont) {
        new_node = cc.LabelBMFont.create("", this.getFntFile());
        new_node.setColor(this.getColor());
        new_node.setOpacity(this.getOpacity());

        //delay render it,since this will take some time.
        var str = this.getString();

        if (sync) {
            new_node.setString(str);
        }
        else {
            //overwrite the setString
            new_node.setString = function (new_str) {
                str = new_str;
            }

            global.nextTick(function () {

                delete new_node.setString;

                //just use the prototype function, the node may be delete yet
                if (new_node.isValidNative()) {
                    new_node.setString(str);
                }
            });
        }
    }
    else if (this instanceof cc.Menu) {

        new_node = cc.Menu.create();
        new_node.setTouchPriority(base_priority + cc.touchPriorityMenu);

        if (this.__has_touch_effect) {
            new_node.setTouchEffect();
        }

        have_child = true;
    }
    else if (this instanceof cc.MenuItemSprite) {

        var normal_sprite = this.getNormalImage();
        var selected_sprite = this.getSelectedImage() || normal_sprite;
        var disabled_sprite = this.getDisabledImage() || normal_sprite;

        new_node = cc.MenuItemSprite.create(
                                    cc.Sprite.createWithSpriteFrame(normal_sprite.displayFrame()),
                                    cc.Sprite.createWithSpriteFrame(selected_sprite.displayFrame()),
                                    cc.Sprite.createWithSpriteFrame(disabled_sprite.displayFrame())
                                );


        new_node.setCallback(function () {

            if (global.events) {
                global.events.emit('menu_click', mount_root, callback_root, mount_name + "_clicked");
            }

            console.log(mount_name + " menu callback : " + index);
            var call_back = callback_root[mount_name + "_clicked"];
            if (call_back) {
                call_back(index, mount_root);
            }
        });

    }
    else if (this instanceof cc.Sprite) {
        new_node = cc.Sprite.createWithSpriteFrame(this.displayFrame());
        new_node.setColor(this.getColor());
        new_node.setOpacity(this.getOpacity());

        have_child = true;
    }
    else if (this instanceof cc.Scale9Sprite) {
        if(global.isValidNative(this.displayFrame()))
        {
            new_node = cc.Scale9Sprite.createWithSpriteFrame(this.displayFrame(), this.getCapInsets());
            new_node.setPreferredSize(this.getPreferredSize());
            new_node.setColor(this.getColor());
            new_node.setOpacity(this.getOpacity());
        }
    }
    //other node type, extend future
    else {

        var ctor = this.constructor;

        if (ctor == cc.Node) {
            new_node = cc.Node.create();

            have_child = true;
        }
        else if (ctor == cc.Layer) {

            new_node = cc.Layer.create();
            new_node.ignoreAnchorPointForPosition(this.isIgnoreAnchorPointForPosition());

            have_child = true;
        }
        else if (this.__copy !== undefined) {
            if (typeof this.__copy === 'function') {
                new_node = this.__copy();
                have_child = new_node.__have_child === undefined ? false : new_node.__have_child;
            } else {
                new_node = cc.Node.create();
                have_child = this.__copy;
            }
        }
        else {

            //otherwise we use node 
            new_node = cc.Node.create();

            console.log("warning : " + ctor + " is not support now! we use cc.Node instead !");
        }
    }

    new_node.setPosition(this.getPosition());
    new_node.setContentSize(this.getContentSize());
    new_node.setAnchorPoint(this.getAnchorPoint());
    new_node.setScaleX(this.getScaleX());
    new_node.setScaleY(this.getScaleY());
    new_node.setRotation(this.getRotation());
    new_node.setTag(this.getTag());
    new_node.setVisible(this.isVisible());

    if (mount_root === undefined) {
        mount_root = new_node;
    }
    if (mount_root) {
        mount_root[mount_name] = new_node;
        new_node.ownerName = mount_name;
    }

    if (have_child) {

        //EditBox in win32 , getChildren will cause problem (CCTextFieldTTF is not export)

        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {

            new_node.addChild(children[i].copyNode(callback_root, mount_root, base_priority, index));
        }
    }
    return new_node;
}

//the node below it
cc.Node.prototype.setBelow = function (node) {
    this._belownode = node;
}

cc.Node.prototype.getBelow = function () {
    if (this._belownode === undefined) {
        this._belownode = null;
    }

    return this._belownode;
}
//------------------------------- add multi modal support -------------------------//

//
// Point
//
cc.p = function( x, y )
{
    return {x:x, y:y};
};

cc.g = cc.g || cc.p;
cc._reuse_grid = cc.g(0,0);

cc.log = cc.log || console.log;

cc.p.resolution = cc.p;

cc.p.counter_resolution = cc.p;

cc.p.add = function (p1, p2) {
    return cc.p(p1.x + p2.x,p1.y + p2.y);
}

cc.p.sub = function (p1, p2) {
    return cc.p(p1.x - p2.x,p1.y - p2.y);
}

cc.p.mult = function (p,f) {
    return cc.p(p.x*f,p.y*f);
}

cc.p.mid = function (p1, p2) {
    return cc.p.mult(cc.p.add(p1, p2), 0.5);
}

cc.p.mult = function (p, f) {
    return cc.p(p.x * f, p.y * f);
}

cc.p.dot = function (p1, p2) {
    return p1.x*p2.x + p1.y*p2.y;
}

cc.p.cross = function (p1, p2) {
    return p1.x*p2.y - p1.y*p2.x
}

cc.p.module = function (p) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

cc.p.module2 = function (p) {
    return p.x * p.x + p.y * p.y;
}

cc.p.distance = function (p1, p2) {
    return cc.p.module(cc.p.sub(p1, p2));
}

cc.p.distance2 = function (p1, p2) {
    return cc.p.module2(cc.p.sub(p1, p2));
}

cc.p.equals = function (p1, p2) {
    return ((p1.x == p2.x) && (p1.y == p2.y));
};

cc.p.equals_almost = function (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 0.01 && Math.abs(p1.y - p2.y) <= 0.01;
}

// extend cc.p
cc.p._add = function (v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
    return v1;
}

cc.p._sub = function (v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
    return v1;
}

cc.p._mult = function (v1, s) {
    v1.x *= s;
    v1.y *= s;
    return v1;
}

cc.p._div = function (v1, s) {
    v1.x /= s;
    v1.y /= s;
    return v1;
}

cc.p.set = function (v, x, y) {
    v.x = x;
    v.y = y;
}

// return value range: -180 ~ 180
cc.p.toAngle = function (v) {
    return Math.atan2(v.y, v.x) * Math.RAD_TO_DEG;
}

Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;

// to rad
// -PI ~ PI
cc.p.toRad = function (v) {
    return Math.atan2(v.y, v.x);
}

// return value range: 0 ~ 180
cc.p.angle = function (v1, v2) {
    return Math.acos(cc.p.dot(cc.p.normalize(v1), cc.p.normalize(v2))) * Math.RAD_TO_DEG;
}

cc.p._angle = function (v1, v2) {
    return Math.acos(cc.p.dot(cc.p._normalize(v1), cc.p._normalize(v2))) * Math.RAD_TO_DEG;
}

cc.p.normalize = cc.pNormalize;

cc.p._normalize = function (p) {
    var dist = cc.p.module(p);
    dist = dist == 0 ? 0 : (1 / dist);
    p.x *= dist;
    p.y *= dist;
    return p;
}

//
// Color 3B
//
cc.c3b = function( r, g, b )
{
    return {r:r, g:g, b:b };
};
cc._c3b = function( r, g, b )
{
    cc._reuse_color3b.r = r;
    cc._reuse_color3b.g = g;
    cc._reuse_color3b.b = b;
    return cc._reuse_color3b;
};

//
// Color 4B
//
cc.c4b = function( r, g, b, a )
{
    return {r:r, g:g, b:b, a:a };
};
cc._c4b = function( r, g, b, a )
{
    cc._reuse_color4b.r = r;
    cc._reuse_color4b.g = g;
    cc._reuse_color4b.b = b;
    cc._reuse_color4b.a = a;
    return cc._reuse_color4b;
};
// compatibility
cc.c4 = cc.c4b;
cc._c4 = cc._c4b;

//
// Color 4F
//
cc.c4f = function( r, g, b, a )
{
    return {r:r, g:g, b:b, a:a };
};

//
// Point
//

cc._p = function( x, y )
{
    if( cc._reuse_p_index == cc._reuse_p.length )
        cc._reuse_p_index = 0;

    var p = cc._reuse_p[ cc._reuse_p_index];
    cc._reuse_p_index++;
    p.x = x;
    p.y = y;
    return p;
};

cc.pointEqualToPoint = function (point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y));
};

//
// Grid
//
cc._g = function( x, y )
{
    cc._reuse_grid.x = x;
    cc._reuse_grid.y = y;
    return cc._reuse_grid;
};

//
// Size
//
cc.size = function(w,h)
{
    return {width:w, height:h};
};
cc._size = function(w,h)
{
    cc._reuse_size.width = w;
    cc._reuse_size.height = h;
    return cc._reuse_size;
};


cc.sizeEqualToSize = function (size1, size2)
{
    return ((size1.width == size2.width) && (size1.height == size2.height));
};

//
// Rect
//
cc.rect = function(x,y,w,h)
{
    return {x:x, y:y, width:w, height:h};
};
cc._rect = function(x,y,w,h)
{
    cc._reuse_rect.x = x;
    cc._reuse_rect.y = y;
    cc._reuse_rect.width = w;
    cc._reuse_rect.height = h;
    return cc._reuse_rect;
};
cc.rectEqualToRect = function (rect1, rect2) {
    return ( rect1.x==rect2.x && rect1.y==rect2.y && rect1.width==rect2.width && rect1.height==rect2.height);
};

cc.rectContainsRect = function (rect1, rect2) {
    if ((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height))
        return false;
    return true;
};

cc.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

cc.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};

cc.rectGetMinX = function (rect) {
    return rect.x;
};

cc.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

cc.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

cc.rectGetMinY = function (rect) {
    return rect.y;
};

cc.rectContainsPoint = function (rect, point) {
    var ret = false;
    if (point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height) {
        ret = true;
    }
    return ret;
};

cc.rectIntersectsRect = function( rectA, rectB )
{
    var bool = ! (  rectA.x > rectB.x + rectB.width ||
                    rectA.x + rectA.width < rectB.x ||
                    rectA.y > rectB.y +rectB.height ||
                    rectA.y + rectA.height < rectB.y );

    return bool;
};

cc.rectUnion = function (rectA, rectB) {
    var rect = cc.rect(0, 0, 0, 0);
    rect.x = Math.min(rectA.x, rectB.x);
    rect.y = Math.min(rectA.y, rectB.y);
    rect.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - rect.x;
    rect.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - rect.y;
    return rect;
};

cc.rectIntersection = function (rectA, rectB) {
    var intersection = cc.rect(
        Math.max(rectA.x, rectB.x),
        Math.max(rectA.y, rectB.y),
        0, 0);

    intersection.width = Math.min(rectA.x+rectA.width, rectB.x+rectB.width) - intersection.x;
    intersection.height = Math.min(rectA.y+rectA.height, rectB.y+rectB.height) - intersection.y;
    return intersection;
};

//
// Array: for cocos2d-html5 compatibility
//
cc.ArrayRemoveObject = function (arr, delObj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == delObj) {
            arr.splice(i, 1);
        }
    }
};

//
// Helpers
//

/*
cc.dump = function(obj)
{
    for( var i in obj )
        cc.log( i + " = " + obj[i] );
};

// dump config info, but only in debug mode
cc.dumpConfig = function()
{
    if( cc.config.debug )
        cc.dump(cc.config);
};
*/

//
// Bindings Overrides
//
// MenuItemToggle
cc.MenuItemToggle.create = function( /* var args */) {

    var n = arguments.length;

    if (typeof arguments[n-2] === 'function' || typeof arguments[n-1] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        var obj = null;
        if( typeof arguments[n-2] === 'function' )
            obj = args.pop();

        var func = args.pop();

        // create it with arguments,
        var item = cc.MenuItemToggle._create.apply(this, args);

        // then set the callback
        if( obj !== null )
            item.setCallback(func, obj);
        else
            item.setCallback(func);
        return item;
    } else {
        return cc.MenuItemToggle._create.apply(this, arguments);
    }
};

// LabelAtlas
cc.LabelAtlas.create = function( a,b,c,d,e ) {

    var n = arguments.length;

    if ( n == 5) {
        return cc.LabelAtlas._create(a,b,c,d,e.charCodeAt(0));
    } else {
        return cc.LabelAtlas._create.apply(this, arguments);
    }
};

cc.LayerMultiplex.create = cc.LayerMultiplex.createWithArray;

// PhysicsDebugNode
/*
cc.PhysicsDebugNode.create = function( space ) {
    var s = space;
    if( space.handle !== undefined )
        s = space.handle;
    return cc.PhysicsDebugNode._create( s );
};
cc.PhysicsDebugNode.prototype.setSpace = function( space ) {
    var s = space;
    if( space.handle !== undefined )
        s = space.handle;
    return this._setSpace( s );
};

// PhysicsSprite
cc.PhysicsSprite.prototype.setBody = function( body ) {
    var b = body;
    if( body.handle !== undefined )
        b = body.handle;
    return this._setBody( b );
};
*/

/**
 * Associates a base class with a native superclass
 * @function
 * @param {object} jsobj subclass
 * @param {object} klass superclass
 */
cc.associateWithNative = function( jsobj, superclass_or_instance ) {

    try {
        // Used when subclassing using the "extend" method
        var native = new superclass_or_instance();
        __associateObjWithNative( jsobj, native );
    } catch(err) {
        // Used when subclassing using the goog.inherits method
       __associateObjWithNative( jsobj, superclass_or_instance );
   }
};

//
// JSB supports 2 official ways to create subclasses
//
// 1) Google "subclasses" borrowed from closure library
// This is the recommended way to do it
//
cc.inherits = function (childCtor, parentCtor) {
	/** @constructor */
	function tempCtor() {};
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor();
	childCtor.prototype.constructor = childCtor;

    // Copy "static" method, but doesn't generate subclasses.
//	for( var i in parentCtor ) {
//		childCtor[ i ] = parentCtor[ i ];
//	}
};
cc.base = function(me, opt_methodName, var_args) {
	var caller = arguments.callee.caller;
	if (caller.superClass_) {
		// This is a constructor. Call the superclass constructor.
		ret =  caller.superClass_.constructor.apply( me, Array.prototype.slice.call(arguments, 1));
		return ret;
	}

	var args = Array.prototype.slice.call(arguments, 2);
	var foundCaller = false;
	for (var ctor = me.constructor;
        ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
		if (ctor.prototype[opt_methodName] === caller) {
			foundCaller = true;
		} else if (foundCaller) {
			return ctor.prototype[opt_methodName].apply(me, args);
		}
	}

	// If we did not find the caller in the prototype chain,
	// then one of two things happened:
	// 1) The caller is an instance method.
	// 2) This method was not called by the right caller.
	if (me[opt_methodName] === caller) {
		return me.constructor.prototype[opt_methodName].apply(me, args);
	} else {
		throw Error(
					'cc.base called from a method of one name ' +
					'to a method of a different name');
	}
};


//
// 2) Using "extend" subclassing
// Simple JavaScript Inheritance By John Resig http://ejohn.org/
//
cc.Class = function(){};
cc.Class.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    // The dummy class constructor
    function Class() {
        // All construction is actually done in the init method
        if (!initializing && this.ctor)
            this.ctor.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
};

cc.Node.prototype.ctor = function() {};
cc.Node.extend = cc.Class.extend;
cc.Layer.extend = cc.Class.extend;
cc.LayerGradient.extend = cc.Class.extend;
cc.LayerColor.extend = cc.Class.extend;
cc.Sprite.extend = cc.Class.extend;
cc.MenuItemFont.extend = cc.Class.extend;
cc.Scene.extend = cc.Class.extend;

//add for multiply resolution
global.designSize = { width: 1280, height: 720 };

// screen_adapter
global.screen_adapter = {};
var screen_adapter = global.screen_adapter;


// 重置ttf的静态文本
screen_adapter.resetTTFLabel = function (node , ccbi) {
    if(!ccbi){
        return;
    }
    ccbi = ccbi.substring(5,ccbi.length - 5);

    //console.log("resetTTFLabel --- %s , ",ccbi , ccbi.length);
    //if(!this.CCBtoTTFtoSTR_tab)
        this.CCBtoTTFtoSTR_tab = global.getDataTable("CCBtoTTFtoSTR");
    //if(!this.Dictionary_tab)
        this.Dictionary_tab = global.getDataTable("Dictionary");
    var ccb_tab = this.CCBtoTTFtoSTR_tab[ccbi];
    if(ccb_tab){

        for(var i = 1 ; i <= ccb_tab.ttf_count ; i++){
            var ccb_label_name = ccb_tab["ttf_mame"+i];
            var ccb_label_str = ccb_tab["ttf_str"+i];

            if(ccb_label_name != "0" && ccb_label_str != "0" && node[ccb_label_name]){
                //console.log("resetTTFLabel --- %s , %s , %s , %s",ccbi,ccb_label_name , ccb_label_str,this.Dictionary_tab[ccb_label_str].string);
                node[ccb_label_name].setString(this.Dictionary_tab[ccb_label_str].string);
            }
        }
    }
}

// switch
screen_adapter.disabled = false;

// size: design size to node space
screen_adapter.sizeToNode = function (size) {
    if (typeof size == 'string') {
        size = this[size + '_size'];
    }

    if (size) {
        var pos = cc.p.resolution(size.width, size.height);
        return cc.size(pos.x, pos.y);
    }
}

screen_adapter.posToNode = cc.p.resolution;

screen_adapter.adaptUI = function (node, modal) {
    if (this.disabled) return;
    node.setScale(this.scale);
    node.setPosition(this.center_offset);
}

screen_adapter.adaptPos = function (node) {
    if (node.getParent()) {
        node.setPosition(node.getParent().convertToNodeSpace(this.center_offset));
    } else {
        console.log('you must add it to a parent before!');
    }
}

screen_adapter.init = function () {
    global.screen_size = global.screen_size || cc.Director.getInstance().getWinSize();
    this.screen_size = global.screen_size;
    this.design_size = global.designSize;

    //override
    var director = cc.Director.getInstance();
    director.getWinSize = function () {
        return global.designSize;
    }
    director.getVisibleSize = function () {
        return global.designSize;
    }    
    director.getScreenSize = function () {
        return screen_adapter.screen_size;
    }

    var sx = this.screen_size.width / this.design_size.width;
    var sy = this.screen_size.height / this.design_size.height;
    this.scale = Math.min(sx, sy);
    this.scale_max = Math.max(sx, sy);
    
    this.sx = sx;
    this.sy = sy;
    this.screen_center = cc.p(this.screen_size.width / 2, this.screen_size.height / 2);
    this.center_offset = cc.p(this.screen_size.width / 2 - this.design_size.width / 2 * this.scale,
        this.screen_size.height / 2 - this.design_size.height / 2 * this.scale);
    this.design_center = cc.p(this.design_size.width / 2, this.design_size.height / 2);

    this.node_size = {};
    this.node_size.design = this.sizeToNode('design');
    // check frame (0 none, 1 horizontal, 2 vertical)
    if (sx != sy) {
        if (this.scale === sx) {
            // horizontal
            this.need_frame = 1;
            this.frame_size = cc.size(this.screen_size.width, this.screen_size.height / 2
                - this.design_size.height * this.scale / 2);
        } else {
            // vertical
            this.need_frame = 2;
            this.frame_size = cc.size(this.screen_size.width / 2 - this.design_size.width * this.scale / 2,
                this.screen_size.height);
        }
        this.inner_size = cc.size(this.design_size.width * this.scale, this.design_size.height * this.scale);
        
    } else {
        this.need_frame = 0;
    }
}

screen_adapter.init();

screen_adapter.scaleBg = function (bg) {
    if (this.disabled) return;

    if (bg instanceof Array) {
        for (var i = 0; i < bg.length; ++i) {
            this.scaleBg(bg[i]);
        }
        return;
    }

    if (bg) {
        bg.__init_scale_x = bg.__init_scale_x || bg.getScaleX();
        bg.__init_scale_y = bg.__init_scale_y || bg.getScaleY();

        bg.setScaleX(bg.__init_scale_x * this.scale_max / this.scale);
        bg.setScaleY(bg.__init_scale_y * this.scale_max / this.scale);
    }
}

// data: [name, type]
// type: 0 mm, 1 lb, 2 rb, 3 lt, 4 rt, 5 lm, 6 rm, 7 mb, 8 mt
// 3 8 4
// 5 0 6
// 1 7 2
screen_adapter.TYPE_VEC = [
    [0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]
];
screen_adapter.TYPE = {
    CENTER: 0,
    LB: 1,
    RB: 2,
    LT: 3,
    RT: 4,
    LEFT: 5,
    RIGHT: 6,
    BOTTOM: 7,
    TOP: 8
};
screen_adapter.setNodePos = function (data, node) {
    if (this.disabled) return;

    if (data instanceof Array && (data[0] instanceof Array)) {
        for (var i = 0; i < data.length; ++i) {
            this.setNodePos(data[i], node);
        }
        return;
    }    

    if (data) {
        // get ref pos
        var type = data[1] || 0;
        var type_vec = this.TYPE_VEC[type];
        var ref_pos = cc.p(this.screen_center.x + type_vec[0] * this.screen_size.width / 2,
            this.screen_center.y + type_vec[1] * this.screen_size.height / 2);
        ref_pos = this.s2d(ref_pos);
        
        // get offset
        var the_node = (typeof data[0] === 'string') ? node[data[0]] : data[0];
        if (the_node) {
            var node_pos = node ? node.convertToNodeSpace(the_node.getParent()
                .convertToWorldSpace(the_node.getPosition())) : the_node.getPosition();
            var offset = cc.p(node_pos.x - (this.design_center.x + type_vec[0] * this.design_size.width / 2),
                node_pos.y - (this.design_center.y + type_vec[1] * this.design_size.height / 2));
            node_pos = cc.p._add(ref_pos, offset);
            if (node) {
                node_pos = this.d2s(node_pos);
                node_pos = the_node.getParent().convertToNodeSpace(node_pos);
            }
            the_node.setPosition(node_pos);
        } else {
            console.log('node ', data[0], ' is not found.');
        }
    }
}

// screen to design
screen_adapter.s2d = function (pos) {
    return cc.p((pos.x - this.center_offset.x) /  this.scale, (pos.y -  this.center_offset.y) / this.scale);
}

// design to screen
screen_adapter.d2s = function (pos) {
    return cc.p(pos.x * this.scale + this.center_offset.x, pos.y * this.scale + this.center_offset.y);
}

// set frame
screen_adapter.setSceneFrame = function (scene, frame) {
    if (!this.need_frame) {
        return;
    }

    if (typeof frame === 'string') {
        frame = cc.Scale9Sprite.create(frame);
    }

    if (scene && frame) {
        var frame1 = frame.copyNode();
        
        var z = cc.layer_frame * cc.zorderBase;
        scene.addChild(frame, z);
        scene.addChild(frame1, z);

        // horizontal
        if (this.need_frame == 1) {
            var scale = this.screen_size.width / frame.getContentSize().width;
            frame.setAnchorPoint(cc.p(0.5, 1));
            frame.setPosition(cc.p(this.screen_size.width / 2, this.frame_size.height));
            frame.setScaleX(scale);
            frame1.setAnchorPoint(cc.p(0.5, 0));
            frame1.setPosition(cc.p(this.screen_size.width / 2, this.screen_size.height - this.frame_size.height));
            frame1.setScaleX(scale);
        } else {
            var scale = this.screen_size.height / frame.getContentSize().height;
            frame.setRotation(-90);
            frame.setAnchorPoint(cc.p(0, 0));
            frame.setPosition(cc.p(this.frame_size.width, 0));
            frame.setScaleX(scale);

            frame1.setRotation(-90);
            frame1.setAnchorPoint(cc.p(0, 1));
            frame1.setPosition(cc.p(this.screen_size.width - this.frame_size.width, 0));
            frame1.setScaleX(scale);
        }
    } else {
        console.log('set scene frame error.');
    }
}