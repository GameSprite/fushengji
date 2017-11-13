//
// CocosBuilder definitions
//

cc.BuilderReader = {};
cc.BuilderReader._resourcePath = "";

cc.BuilderReader.setResourcePath = function (rootPath) {
    cc.BuilderReader._resourcePath = rootPath;
};

var _ccbGlobalContext = this;

// emit btn msg
cc.BuilderReader.setCallback = function (node, callbackName, owner) {
    var func = function () {
        console.log(callbackName);

        if (global.events) {
            global.events.emit('menu_click', node, owner, callbackName);
        }

        if (owner[callbackName]) {
            return owner[callbackName].apply(owner, arguments);
        }
    };
    node.setCallback(func, owner);
    node.__callback = func;
    node.__callback_name = callbackName;
}

// handle some nodes
var TAG_COLOR = 100000;
cc.BuilderReader.TAG_COLOR = TAG_COLOR;

cc.BuilderReader._handle = function (c) {
    // color
    if (c.setColor) {
        var tag = c.getTag();
        var tag_color = (c instanceof cc.LabelTTF) ? 1000 : TAG_COLOR;
        if (tag >= tag_color) {
            if (!global.jsondata) {
                return;
            }
            var color_index = Math.floor(tag / tag_color);
            var d = global.jsondata.get('GameColor', color_index);
            c.setColor(cc.c3b(d.red, d.green, d.blue));
            tag -= color_index * tag_color;

            // reset tag
            c.setTag(tag);
        }
    }

    // menu effect
    if (c instanceof cc.Menu && c.getTag() === -1) {
        var tag = c.getTag();
        if (c.setTouchEffect) {
            c.setTouchEffect();
        }
    }
}

cc.BuilderReader.handle = function (node) {
    var children = node.getChildren();    
    for (var i = 0; i < children.length; ++i) {
        var c = children[i];
        this._handle(c);

        // handle children
        this.handle(c);
    }
}

cc.BuilderReader.load = function (file, owner, parentSize) {
    // Load the node graph using the correct function
    var reader = cc._Reader.create();
    reader.setCCBRootPath(cc.BuilderReader._resourcePath);

    //check owner is async
    if (owner.async) {
        reader.setAsync(true);
    }

    var node;

    if (owner && parentSize) {
        node = reader.load(file, owner, parentSize);
    }
    else if (owner) {
        node = reader.load(file, owner);
    }
    else {
        node = reader.load(file);
    }

    // handle
    if (node) {
        this.handle(node);
    }

    // Assign owner callbacks & member variables
    if (owner) {
        // Callbacks
        var ownerCallbackNames = reader.getOwnerCallbackNames();
        var ownerCallbackNodes = reader.getOwnerCallbackNodes();

        for (var i = 0; i < ownerCallbackNames.length; i++) {
            var callbackName = ownerCallbackNames[i];
            var callbackNode = ownerCallbackNodes[i];

            this.setCallback(callbackNode, callbackName, owner);
        }

        // Variables
        var ownerOutletNames = reader.getOwnerOutletNames();
        var ownerOutletNodes = reader.getOwnerOutletNodes();

        for (var i = 0; i < ownerOutletNames.length; i++) {
            var outletName = ownerOutletNames[i];
            var outletNode = ownerOutletNodes[i];

            owner[outletName] = outletNode;

            //add name to node
            outletNode.ownerName = outletName;
        }
    }

    var nodesWithAnimationManagers = reader.getNodesWithAnimationManagers();
    var animationManagersForNodes = reader.getAnimationManagersForNodes();

    // Attach animation managers to nodes and assign root node callbacks and member variables
    for (var i = 0; i < nodesWithAnimationManagers.length; i++) {
        var innerNode = nodesWithAnimationManagers[i];
        var animationManager = animationManagersForNodes[i];

        innerNode.animationManager = animationManager;

        var documentControllerName = animationManager.getDocumentControllerName();
        if (!documentControllerName) continue;

        // Create a document controller
        var controller = new _ccbGlobalContext[documentControllerName]();
        controller.controllerName = documentControllerName;

        innerNode.controller = controller;
        controller.rootNode = innerNode;

        // Callbacks
        var documentCallbackNames = animationManager.getDocumentCallbackNames();
        var documentCallbackNodes = animationManager.getDocumentCallbackNodes();

        for (var j = 0; j < documentCallbackNames.length; j++) {
            var callbackName = documentCallbackNames[j];
            var callbackNode = documentCallbackNodes[j];

            this.setCallback(callbackNode, callbackName, controller);
        }


        // Variables
        var documentOutletNames = animationManager.getDocumentOutletNames();
        var documentOutletNodes = animationManager.getDocumentOutletNodes();

        for (var j = 0; j < documentOutletNames.length; j++) {
            var outletName = documentOutletNames[j];
            var outletNode = documentOutletNodes[j];

            controller[outletName] = outletNode;
        }

        if (typeof (controller.onDidLoadFromCCB) == "function") {
            controller.onDidLoadFromCCB();
        }
    }

    return node;
};

cc.BuilderReader.loadAsScene = function(file, owner, parentSize)
{
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild( node );

    return scene;
};
