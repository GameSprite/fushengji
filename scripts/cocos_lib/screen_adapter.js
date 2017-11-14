//add for multiply resolution
global.designSize = { width:720, height: 1280 };
// screen_adapter
var screen_adapter = {};
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

screen_adapter.adaptPos = function (node) {
    if (node.getParent()) {
        node.setPosition(node.getParent().convertToNodeSpace(this.center_offset));
    } else {
        console.log('you must add it to a parent before!');
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
exports.screen_adapter = screen_adapter;