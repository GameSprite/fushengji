//clear file caches,maybe something is update
cc.FileUtils.getInstance().purgeCachedEntries();
//no need background run in game
__needBackground(false);

//TODO 全局对象声明
/*全局对象申明*/
global.tables = null;           //global data : static and dynamic 
global.msg = null;
global.data = null;             //在里边存储一些全局变量等
global.const = null;            //全局常量
global.modules = null;          //全局模块
global.fn = null;               //全局函数
global.res = null;              //global resource function
global.str = null;              //global string
global.config = null;           //客户端的配置

//TODO 全局对象初始化
/*************************全局对象初始化***************************/
//初始化cocos js 导出函数
require("./cocos_lib/jsb_constants");

//初始化全局方法
global.fn = require("./game/init/fn").funcs;
//初始化全局常量
global.const = require("./game/init/const").consts;
//初始化全局的协议
global.MSG = require("./game/init/msg").MSG;
//初始化全局模块
global.modules = require("./game/init/module").modules;
//初始化资源索引对象
global.res = require("./game/init/res").resources;
//初始化字符串索引对象
global.str = require("./game/init/str").strs;
//读取客户端配置文件
var configReader = require("./lib/config");
global.config = configReader.read(__dirname + "./config.ini");
//初始化管理器
global.scene_manager = global.modules.StatusManager;
global.audio_manager = global.modules.AudioManager;
global.shader_manager = global.modules.shaderMannager;
//定义global.logserver
var platform = os.platform();
global.logserver = null;
if(platform == "ios" || platform == "android"){
    var server_c = require("../lib/net").create(global.config.lanuch_server.serverip,
    											global.config.lanuch_server.serverport,
    										    0, 
    										    0);
    //store the send , avoid be hook by others.
    var my_send = server_c.send.bind(server_c);
    
    //format : {os : str, mac : str, type : str, data : str}
    global.logserver = function(){
        var str = util.format.apply(this, arguments);
        my_send("_exception_", {"os":os.machine(), "mac":os.mac(), "type":"log", "data":str});
    }
}else{
    global.logserver = console.log;
}

//初始化客户端json表
global.tables = {};
var jsonFiles = fs.readdir("./data");
if(jsonFiles){
    jsonFiles.forEach(function(filename){
        //其他文件过滤
        if(!fs.isfile("./data/"+filename)){
            return;
        }
        var ext = filename.slice(filename.lastIndexOf(".") + 1);
        if(!(ext == "json" || ext == "b")){
            return;
        }
        //读取文件
        var buffer = fs.readfile("./data/"+filename);
        ext == "b" && zlib.inflateRaw(buffer);

        //数据处理
        var dataStr = buffer.toString().replace(/\\\\/g, "\\");
        try{
            var obj = JSON.parse(dataStr);
            var keys = Object.keys(obj);
            var ext_name = ext == 'json' ? 'Des.json' : 'Des.json.b';
            global.tables[filename.slice(0, filename.lastIndexOf(ext_name))] = obj[keys[0]];
        }catch(e){
            console.log('JSON parse ', filename, ' error!'); 
        }
    });
}

//TODO 全局处理
/*******************************全局处理************************************/
//前后台切换事件绑定回调
//进入后台
var broadCast = global.modules.broadCast;
__setBackgroundCallback(function(){
    broadCast.getInstance().emit("background");
});
//进入前台
__setForegroundCallback(function(){
    broadCast.getInstance().emit("foreground");
});

