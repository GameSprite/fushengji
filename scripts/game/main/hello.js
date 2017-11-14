var scene = cc.Scene.create();
cc.Director.getInstance().runWithScene(scene);

var layer = cc.Layer.create();
scene.addChild(layer);

console.log("cgz:",global.res.jpg("bg"));
var bg = cc.Sprite.create(global.res.jpg("bg"));
bg.setAnchorPoint(cc.p(0,0));
bg.setScale(global.screen_adapter.scale);
layer.addChild(bg);