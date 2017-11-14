
var platform = os.platform();

/**************************************/
/*             调试用相关            */
/**************************************/
//是否输出游戏日志
//TODO 是否输出游戏日志
cc.Director.getInstance().setDisplayStats(false);

if (platform == "ios" || platform == "android") {
    global.debug = 0;
}else{
    global.debug = 1;
}
//重写console.log
var util = require("./lib/util");
if (global.debug == 0) {
    console.log = function(){/*empty*/};
}else{
    console.log.extend = 1;
    console.log.depth = 5;
    if (console.log.extend == 1) {
        var srcLog = console.log;
        //修改console.log
        console.log = function (val) {
            // 获取脚本路径
            var err = new Error("");
            var line_strs = err.stack.split('\n');
            line_strs.splice(0, 1);     // remove the first as it's 'console.log'            
            // format str
            function formatStr(parts) {
                var index = parts.length > 1 ? 1 : 0;
                var str = parts[index];
                str = str.replace('.js', '');
                str = str.slice(str.lastIndexOf('/') + 1, str.length);
                return str;
            }

            var len = srcLog.depth;
            if (line_strs.length < len) {
                len = line_strs.length;
            }
            var info = '';
            // normal easy mode
            for (var i = len - 1; i >= 0; --i) {
                var parts = line_strs[i].split('@');
                if (parts.length > 1 && parts[1] != '') {
                    info += (formatStr(parts) + (i == 0 ? '' : '->'));
                }
            }
            srcLog('<' + info + '>:' + util.format.apply(this, arguments));
        }
    }
}
//定义global.nextTick
var next_fn = [];
var next_inter = null;
var next_max = 100;
global.nextTick = function (cb) {

    if (next_fn.length >= next_max) {
        console.log2("warning ! nextTick have reach max function array  : " + next_max);
    }
    next_fn.push(cb);
    if (next_inter === null) {
        var first = false;
        next_inter = setInterval(function () {
            if (!first) {
                first = true;
            }
            else {
                //clear first,to support nextTick call nextTick
                clearInterval(next_inter);
                next_inter = null;
                var fn_arr = next_fn;
                next_fn = [];

                var errs = "";
                for (var i = 0; i < fn_arr.length; i++) {
                    try {
                        fn_arr[i]();
                    }
                    catch (e) {
                        errs += e.toString();
                        errs += "\n stack : \n";
                        errs += e.stack;
                        errs += "\n";
                    }
                }
                if (errs.length > 0) {
                    throw new Error(errs);
                }
            }
        }, 1);
    }
}
/**************************************/
/*             程序初始化            */
/**************************************/
require("./init");

/**************************************/
/***********      main ****************/
/**************************************/
require("./game/main/hello")