
function sdk_base(flag) {

    this.enabled = flag == undefined ? true : flag;

    if (!this.enabled) {
        this.login_type = 0;
    }

    this.is_sdk_login = false;
    //id prefix -- from billing define_code
    this.uid_prefix = "a_s_ly";
    this.channel = "sdk_ly";
    this.promotion = "sdk_ly";
    this.is_indonesia  = false; //是否为印尼渠道
    this.platform = -1;

    this.sdk_update = false;

    this.sdk_uid = "";
    this.sdk_extension = "";

    this.client_info = "";

    this.init_clien_info();

    //sound default open
    this.sound = true;

    //not need background default
    this.need_background = false;

    // 记录切换状态
    this.switch_account = 0;

    this.uid = "";
    this.account_type = 0;
    this.account_name = "";

    this.level = 1;
    this.gender = 0;
    this.age = 0;
    this.sid = "";
    this.server_name = "";
    this.role_id = 0;
    this.role_name = "";
    this.money = 0;
    this.create_date = 0;

    this.order_id = "";
    this.pay_amount = 0;
    this.pay_commodity_id = 0;

    this.googlePayData = null;//vp_af的支付列表是从google play获取下来的
    //30 seconds
    this.timeout = 1200000;
}
sdk_base.prototype.prepare = function (cb) {
    cb(1);
}

sdk_base.prototype.init_clien_info = function () {

    if (!this.enabled) {
        var data = {};

        data.versionCode = "1.0";
        data.sdkChannelName = this.channel;
        data.sdkPromotion = this.promotion;

        data.deviceId = "pc";
        data.network = "wifi";
        data.operator = "windows";
        data.osVersion = "1.0";
        data.brandModel = "pc-no.999";

        this.client_info = JSON.stringify(data);

    }

}

sdk_base.prototype.setCallback = function (cb) {
    this.cb = cb;
}

sdk_base.prototype.login = function (cb) {
    cb(0);
}

sdk_base.prototype.set_sdk_userid = function (uid) {
}

sdk_base.prototype.is_sdk_login = function () {
    return this.is_sdk_login;
}
sdk_base.prototype.logout = function (type) {
}
sdk_base.prototype.pay = function () {
}
sdk_base.prototype.later_login = function (cb)
{

}
//新加分享接口
sdk_base.prototype.share = function (cb)
{

}
//新加邀请接口
sdk_base.prototype.invite = function (cb)
{

}
//新加获得migme货币余额接口
sdk_base.prototype.get_migme_balance  = function(cb){

}
//新加弹出migme货币充值接口
sdk_base.prototype.buy_migme  =  function(cb){

}
//新加migme货币购买元宝接口
sdk_base.prototype.migme_buy_gold  = function(cb){

}

//新加腾讯logout
sdk_base.prototype.txLogout = function (cb)
{

}
sdk_base.prototype.extra_data = function (type) {
}
sdk_base.prototype.reload = function (obj) {
}


sdk_base.prototype.set_server_info = function (sid, sname) {
    this.sid = sid;
    this.server_name = sname;
}

sdk_base.prototype.set_role_level = function (level) {
    this.level = level;
}

sdk_base.prototype.set_role_money = function (money) {
    this.money = money;
}

sdk_base.prototype.setuid = function (uid) {
    console.log("---------- setuid ---------");

    var self = this;
    /*if(self.login_type == 2){
     // 需要帐号服务器认证的SDK，帐号前缀不需要加
     self.uid = uid;
     }else{
     self.uid = self.uid_prefix + uid;
     }*/
    self.uid = self.uid_prefix + uid;
    console.log("sdk_base self.uid_prefix",self.uid_prefix);
    console.log("sdk_base this.uid_prefix",this.uid_prefix);
    console.log("sdk_base self.uid",self.uid);
    console.log("sdk_base this.uid",this.uid);
}

sdk_base.prototype.stat_onlyfun = function (fun_name, json_data) {
}

////////////////////////////////////////////////////
// 注意：以下td_stat_xxx 函数不要在子类中定义！！！
// TalkingData统计
sdk_base.prototype.td_stat_onlyfun = function (fun_name, json_data) {

    // if (fun_name == "td_stat_setAccount") {
    //     this.td_stat_setAccount(fun_name, json_data);
    // } else if (fun_name == "td_stat_setLevel") {
    //     this.td_stat_setLevel(fun_name, json_data);
    // } else if (fun_name == "td_stat_onChargeRequest") {
    //     this.td_stat_onChargeRequest(fun_name, json_data);
    // } else if (fun_name == "td_stat_onChargeSuccess") {
    //     this.td_stat_onChargeSuccess(fun_name, json_data);
    // } else if (fun_name == "td_stat_onReward") {
    //     this.td_stat_onReward(fun_name, json_data);
    // } else if (fun_name == "td_stat_onPurchase") {
    //     this.td_stat_onPurchase(fun_name, json_data);
    // } else if (fun_name == "td_stat_onUse") {
    //     this.td_stat_onUse(fun_name, json_data);
    // } else if (fun_name == "td_stat_onMissionBegin") {
    //     this.td_stat_onMissionBegin(fun_name, json_data);
    // } else if (fun_name == "td_stat_onMissionCompleted") {
    //     this.td_stat_onMissionCompleted(fun_name, json_data);
    // } else if (fun_name == "td_stat_onMissionFailed") {
    //     this.td_stat_onMissionFailed(fun_name, json_data);
    // } else if (fun_name == "td_stat_onEvent") {
    //     this.td_stat_onEvent(fun_name, json_data);
    // }
}

// 以下为TalkingData统计接口，仅在父类sdk_base中定义及调用
// 统计玩家帐户
sdk_base.prototype.td_stat_setAccount = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDSetAccount";
    obj.account_id = this.uid;
    obj.account_type = this.account_type;
    obj.account_name = this.account_name;
    obj.level = this.level;
    obj.gender = 0;
    obj.age = 0;
    obj.server_id = this.sid;
    if(typeof(thirdsdk.onlyfun) =="function"){
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 设置级别
sdk_base.prototype.td_stat_setLevel = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDSetLevel";
    obj.account_id = this.uid;
    obj.level = json_data.level;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 跟踪玩家充值
// 充值请求
//
// -- order_id: 订单ID，最多64个字符。 用于唯一标识一次交易。 *如果多次充值成功的orderID重复，将只计算首次成功的数据，其他数据会认为重复数据丢弃。
//              *如果Success调用时传入的orderID在之前Request没有对应orderID，则只记录充值次数，但不会有收入金额体现。
// -- iap_id:    充值包ID，最多32个字符。 唯一标识一类充值包。 例如：VIP3礼包、500元10000宝石包
// -- amount:   充值金额(double)
// -- currency_type: 货币类型， 请使用国际标准组织ISO 4217中规范的3位字母代码标记货币类型。点击查看参考 例：人民币CNY；美元USD；欧元EUR
//              （如果您使用其他自定义等价物作为现金，亦可使用ISO 4217中没有的3位字母组合传入货币类型，我们会在报表页面中提供汇率设定功能）
// -- virtual_amount: 虚拟货币，如元宝，钻石等
// -- pay_type： 支付类型，最多16个字符。 例如：“支付宝”“苹果官方”“XX支付SDK”
sdk_base.prototype.td_stat_onChargeRequest = function (fun_name, json_data) {

    /*
     var timestamp = new Date().getTime();
     var rnd = Math.floor(Math.random() * 100) + 10;
     var order_id = this.uid + "-" + timestamp + "-" + rnd;
     this.order_id = order_id;

     var obj = {};
     obj.fun_name = "TDOnChargeRequest";
     obj.order_id = json_data.order_id;
     obj.iap_id = json_data.iap_id;
     obj.amount = json_data.amount;
     obj.currency_type = json_data.currency_type;
     obj.virtual_amount = json_data.virtual_amount;
     obj.pay_type = json_data.pay_type;
     */

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            // nothing do
        });
    }
}

// 充值成功
// 一次完整的充值过程需要有 onChargeRequest和onChargeSuccess的调用，且order_id必须保持一致
sdk_base.prototype.td_stat_onChargeSuccess = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnChargeSuccess";
    obj.order_id = json_data.order_id;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 跟踪获赠的虚拟币
// virtual_amount: 虚拟币金额
// reason: 赠送虚拟币原因/类型。 格式：32个字符内的中文、空格、英文、数字。不要带有任何开发中的转义字符，如斜杠。 注意：最多支持100种不同原因。
sdk_base.prototype.td_stat_onReward = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnReward";
    obj.item = json_data.item;
    obj.virtual_amount = json_data.virtual_amount
    obj.reason = json_data.reason;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 跟踪游戏消费点
// 记录付费点
// item: 某个消费点的编号，最多32个字符。如购买虚拟道具、VIP服务、复活等
// number: 消费数量或次数
// virtual_currency: 虚拟币单价
sdk_base.prototype.td_stat_onPurchase = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnPurchase";
    obj.item = json_data.item;
    obj.number = json_data.number;
    obj.virtual_currency = json_data.virtual_currency;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 消耗物品或服务等
// item: 某个消费点的编号，最多32个字符。如购买虚拟道具、VIP服务、复活等
// number: 消费数量或次数
sdk_base.prototype.td_stat_onUse = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnUse";
    obj.item = json_data.item;
    obj.number = json_data.number;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 任务、关卡或副本
// 接受或进入
// mission_id: 任务、关卡或副本的编号，最多32个字符。 此处可填写ID，别名可在报表编辑。
sdk_base.prototype.td_stat_onMissionBegin = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnMissionBegin";
    obj.mission_id = json_data.mission_id;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 任务、关卡或副本
// 完成
// mission_id: 任务、关卡或副本的编号，最多32个字符。 此处可填写ID，别名可在报表编辑。
sdk_base.prototype.td_stat_onMissionCompleted = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnMissionCompleted";
    obj.mission_id = json_data.mission_id;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

// 任务、关卡或副本
// 失败
// mission_id: 任务、关卡或副本的编号，最多32个字符。 此处可填写ID，别名可在报表编辑。
// cause: 失败原因，最多16个字符。共支持100种原因
sdk_base.prototype.td_stat_onMissionFailed = function (fun_name, json_data) {
    var obj = {};
    obj.fun_name = "TDOnMissionFailed";
    obj.mission_id = json_data.mission_id;
    obj.cause = json_data.cause;
    if (typeof (thirdsdk.onlyfun) == "function"){
        thirdsdk.onlyfun(JSON.stringify(obj), function (str) {
            // nothing do
        });
    }
}

///////////////////////////////////////////////////////////////////////
// 自定义事件
// -- 用于统计任何您期望去跟踪的数据，如：点击某功能按钮、填写某个输入框、触发了某个广告等。
// -- 可以自行定义eventId，在游戏中需要跟踪的位置进行调用，注意eventId中仅限使用中英文字符、数字和下划线，不要加空格或其他的转义字符。
// -- 除了可以统计某自定义eventId的触发次数外，还可以通过key-value参数来对当时触发事件时的属性进行描述。如定义eventId为玩家死亡事件，可添加死亡时关卡、死亡时等级、死亡时携带金币等属性，通过key-value进行发送。
// -- 每款游戏可定义最多200个不同eventId，每个eventId下，可以支持20种不同key的500种不同value取值（String类型），并且注意每个单次事件调用时，最多只能附带10种不同key。
sdk_base.prototype.td_stat_onEvent = function (fun_name, json_data) {
    // 数据结构由调用者定义
    json_data.fun_name = "TDOnEvent";
    if(typeof(thirdsdk.onlyfun) =="function"){
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            // nothing do
        });
    }
}

// SDK 接口
//--------------------------- self sdk --------------------------------------//
sdk_self.prototype.__proto__ = sdk_base.prototype;

function sdk_self() {

    //call parent contractor
    sdk_base.call(this, true);
    this.status();
    this.logout(0);
}

sdk_self.prototype.prepare = function(cb){
    var self = this;
    console.log("sdk_self---sdk-------------prepare");
    var json_data = {};
    if (global.Language != undefined && global.Language.current != undefined)
    {
        json_data.language_type = global.Language.current + "";
    }else
    {
        json_data.language_type = "en";
    }

    console.log("json_data.language_type===" + json_data.language_type);
    json_data.fun_name = "prepare";
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            //
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if(fun_name == "prepare"){
                cb(ret_json.is_update);
            }
        });
    }
}

sdk_self.prototype.status = function(){
    var self = this;

    var json_data = {};
    json_data.fun_name = "status";
    json_data.language_type = global.Language.current;
    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            console.log("-----------  onlyfun  -----------");
            //console.log("",str);
            if(str == undefined || str == ""){
                return;
            }
            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if(fun_name == "status"){
                self.uid_prefix = ret_json.partnerId;

                //from billing define_code
                self.login_type = parseInt(ret_json.login_type);

                self.channel = ret_json.channel;

                self.client_info = ret_json.clientInfo;

                if (ret_json.is_indonesia)
                {
                    self.is_indonesia =  ret_json.is_indonesia;
                }

                /////////////////////////////////////////////////
                // 腾讯YSDK特殊处理
                if(self.channel == "sdk_tx"){
                    var cb;
                    self.login(cb, 0)
                }
                //////////////////////////////////////////////////
                // init sdk stat
                if(!global.sdk_stat){
                    global.sdk_stat = require("./stat").statMannager;
                }
                global.sdk_stat.init(true, self.channel);
            }
        });
    }
}

sdk_self.prototype.setCallback = function (cb) {
    this.cb = cb;
    this.login(cb, 1)

}

//cb(err)   0 : ok  ,  1 : failed  ,  2 : other
sdk_self.prototype.login = function (cb, flag) {
    var self = this;

    if (cb) {
        this.cb = cb;
    } else {
        cb = this.cb;
    }

    if(!flag){
        flag = 0;
    }

    // 切换账号成功，直接登录无需再次登录
    if (self.switch_account == 1) {
        global.sdk.token = self.uid;
        global.sdk.isjustlogin = true;
        if (cb) {
            cb(0);
        }

        self.switch_account = 0;
        return;
    }

    console.log("sdk_self.login 1");
    var time_end = false;
    var timeid = setTimeout(function () {

        time_end = true;

        //timeout
        if (cb) {
            cb(2);
        }

    }, self.timeout);

    var json_data = {};
    json_data.fun_name = "login";
    json_data.type = flag;
    json_data.platform = this.platform; // 1-google登录 2-facebook登录

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            console.log("sdk_self.login 2");
            console.log("str");
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            //if (!time_end) {
            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if(fun_name == "login"){

                //console.log("ret_json:");
                //console.log(ret_json);

                if(ret_json.uid == "-999"){
                    console.log("sdk_self.login-----ret_json.uid------==-999");
                    // 自己ios账号登录
                    if (cb) {
                        self.cb(ret_json.code);
                    }
                }else if (ret_json.uid == "-10000"){ //显示腾讯登录界面
                    global.scene_manager.changeStatus("update_tx");
                }else if(ret_json.uid == "-1"){
                    // login failure
                    global.sdk._login_state = false;
                }else{

                    //clear timeid
                    clearTimeout(timeid);

                    //在这里加入爱上游戏的数据处理
                    if(ret_json.token){
                        self.uid = ret_json.sdkUserID;
                        var clientInfoJson = JSON.parse(self.client_info);
                        for(var key in ret_json){
                            clientInfoJson[key] = ret_json[key];
                        }
                        self.client_info = JSON.stringify(clientInfoJson);
                    }else{
                        global.sdk.token = ret_json.uid;
                        // global.sdk.isjustlogin = true; 金晓辉修改
                        if(self.channel != "sdk_tx" && self.channel != "sdk_vp")//判断是否为腾讯 global.sdk.isjustlogin = true;
                            global.sdk.isjustlogin = true;
                        //set sound
                        self.sound = (ret_json.sound == 1);
                        self.uid = ret_json.uid;
                    }

                    if (cb) {
                        self.cb(ret_json.code);
                    }
                }
            }
            //}
        });
    }
}

sdk_self.prototype.set_sdk_userid = function (uid, extension) {
    console.log("------------------- set_sdk_userid uid:"+uid);

    if (!uid) {
        return;
    }

    if (!extension) {
        extension = "0";
    }

    var json_data = {};
    json_data.fun_name = "sdk_userid";
    json_data.sdk_uid = uid;
    json_data.sdk_extension = extension;

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
        });
    }
}

sdk_self.prototype.logout = function (type) {
    var self = this;
    if(type == undefined){
        type = 0;
    }

    console.log("sdk_self.logout 1");
    var json_data = {};
    json_data.fun_name = "logout";
    json_data.type = type;

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
            console.log("sdk_self.logout 2");
            console.log("str");
            console.log(str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if(fun_name == "logout"){
                var type = ret_json.type;
                var token = ret_json.token;
                console.log("exit client!");
                // sdk 统计需要
                //self.extra_data(5);

                /*if(type == 1){
                 // 退出清除数据在登录，适用于快用子账号登录退出模式
                 global.logout();
                 }else if(type == 2){
                 // 直接关闭客户端
                 __exit();
                 }*/

                if(type == 2){
                    // 直接关闭客户端
                    __exit();
                }else if(type == 3){

                    global.sdk.isjustlogin = false;

                    console.log("cancel login ...");
                    //console.log("",token);
                    self.uid = token;
                    if (self.channel == "sdk_xy" && global.is_enter_server) {
                        //self.cb(0);
                    }else{
                        self.cb(0);
                    }
                }else{
                    // 退出清除数据在登录
                    if (type == 4) {
                        self.switch_account = 1;
                    } else {
                        self.switch_account = 0;
                    }

                    global.logout(1);

                    global.sdk.isjustlogin = true;
                    global.is_enter_server = false;

                    console.log("logout ...");
                    //console.log("",token);
                    self.uid = token;
                    self.cb(0);
                }
            }
            if(global.enabled_sdk == "1"){
                self.logout(0);
            }
        });

    }
}

//cb(err)     0 : ok  ,  1 : failed  ,  2 : cancel

/* sdk need
 int buyNum = json.optInt("buyNum", 1);
 int coinNum = json.optInt("coinNum", 100);
 int price = json.optInt("price", 1);
 String productId = json.optString("productId", "0");
 String productName = json.optString("producName", "元宝");
 String productDesc = json.optString("productDesc", "元宝");
 String roleId = json.optString("roleId", "1");
 int roleLevel = json.optInt("roleLevel", 1);
 String roleName = json.optString("roleName", "角色名");
 String serverId = json.optString("serverId", "100000");
 String serverName = json.optString("serverName", "100000");
 String vip = json.optString("vip", "1");
 String orderId = json.optString("orderId", "1");
 */
sdk_self.prototype.pay = function (pay_data, cb) {

    if (!pay_data) {
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(pay_data), function (str) {
            console.log("sdk_self.pay str:");
            //console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "pay") {
                var result = Number(ret_json.result);
                var login_data = ret_json.login_data;
                cb(result, login_data);
            }
        });
    }
}
//ios登录后的回调
sdk_self.prototype.later_login = function (login_data, cb) {

    if (!login_data) {
        console.log("sdk_self--later_login---login_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(login_data), function (str) {
            console.log("sdk_self.later_login str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "later_login") {
                var result = Number(ret_json.result);
                var result_data = ret_json.login_data;
                cb(result, result_data);
            }
        });
    }
}
sdk_self.prototype.extra_data = function (type) {
    /*
     UserExtraData就是游戏内玩家的数据，
     比如在选择服务器时，extraData中的dataType为1；
     创建角色的时候，dataType为2；
     进入游戏时，dataType为3；
     等级提升时，dataType为4；
     退出游戏时，dataType为5
     创建出新账号时,dataType为6

     dataType	int	调用时机

     serverID	String	玩家所在服务器的ID
     serverName	String	玩家所在服务器的名称
     roleID		String	玩家角色ID
     roleName	String	玩家角色名称
     roleLevel	String	玩家角色等级
     moneyNum 	String	当前角色身上拥有的游戏币数量
     */

    var self = this;

    if (!global.sdk.sid) {
        global.sdk.sid = "";
    }

    var json_data = {};
    json_data.fun_name = "extra_data";
    json_data.type = type;
    json_data.serverID = Number(global.sdk.sid);
    json_data.serverName = global.sdk.server_name;
    json_data.roleID = global.sdk.role_id+"";
    json_data.roleName = global.sdk.role_name;
    json_data.roleLevel = global.sdk.level+"";
    json_data.moneyNum = Number(global.sdk.money);
    json_data.account  = global.sdk.uid; //角色账号
    json_data.vipLevel = Number(global.main_data.player_data.roleVipLv);

    if (self.channel == "sdk_uc") {
        json_data.createDate = global.sdk.create_date+"";
    }

    console.log("------------------------- extra_data ");
    console.log(""+JSON.stringify(json_data));

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(json_data), function (str) {
        });
    }

}


sdk_self.prototype.set_server_info = function (sid, sname) {
    console.log("------------------- set_server_info sid:"+sid+" sname:"+sname);
    this.sid = sid;
    this.server_name = sname;
}

sdk_self.prototype.set_role_level = function (level) {
    this.level = level;
}

sdk_self.prototype.set_role_money = function (money) {
    this.money = money;
}

sdk_self.prototype.setuid = function (uid) {
    console.log("---------- setuid ---------");

    var self = this;

    /*if(self.login_type == 2){
     // 需要帐号服务器认证的SDK，帐号前缀不需要加
     self.uid = uid;
     }else{
     self.uid = self.uid_prefix + uid;
     }*/
    self.uid = self.uid_prefix + uid;
    console.log("self.uid_prefix",self.uid_prefix);
    console.log("this.uid_prefix",this.uid_prefix);
    console.log("self.uid",self.uid);
    console.log("this.uid",this.uid);
}

//need reload when interface is changed
sdk_self.prototype.reload = function (obj) {

    var self = this;
    self.sound = obj.sound;

    // var index = obj.uid.indexOf(self.uid_prefix);
    // if (index != -1) {
    //     self.uid = obj.uid;
    // }
    // else {
    //     self.uid = self.uid_prefix + obj.uid;
    // }
}

////////////////////////////////////////////////////
// 统计接口
sdk_self.prototype.stat_onlyfun = function (fun_name, json_data) {
    // TalkingData统计
    global.sdk.td_stat_onlyfun(fun_name, json_data);
}

//新加分享接口
/**
 返回数据{"type":10001,"fun_name":"share","errno":"0"}
 type 类型，10000代表游戏内部请求分享,10001安卓客户端返回请求结果。
 errno 错误码
 **/
sdk_self.prototype.share = function (share_data, cb)
{
    console.log("sdk_self--share---callback");
    if (!share_data) {
        console.log("sdk_self--share---share_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(share_data), function (str) {
            console.log("sdk_self.share str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "share") {
                var result = Number(ret_json.result);
                var result_data = ret_json.login_data;
                console.log("sdk_self--share---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}
/**
 返回数据:{"data":"[{}]","type":20001,"fun_name":"invite"} 为json数据需,客户端解析
 type为20000游戏内部请求好友列表，type为20001返回好友列表, type为20002游戏内部请求发送分享,type为20003安卓返回分享结果
 data 为好友列表数组
 **/
//新加邀请接口
sdk_self.prototype.invite = function (invite_data, cb)
{
    console.log("sdk_self--invite---callback");
    if (!invite_data) {
        console.log("sdk_self--invite---invite_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(invite_data), function (str) {
            console.log("sdk_self.invite str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "invite") {
                var result = Number(ret_json.result); //回调结果码
                var result_data = ret_json.login_data;
                console.log("sdk_self--invite---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}

//新加获得migme货币余额接口
sdk_self.prototype.get_migme_balance  = function(migme_data,cb){

    console.log("sdk_self--get_migme_balance---callback");
    if (!migme_data) {
        console.log("sdk_self--get_migme_balance---migme_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(migme_data), function (str) {
            console.log("sdk_self.invite str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "get_migme_balance") {
                var result = Number(ret_json.result); //回调结果码
                var result_data = ret_json.balance;
                console.log("sdk_self--get_migme_balance---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}
//新加弹出migme货币充值接口
sdk_self.prototype.buy_migme  = function(buy_data,cb){

    console.log("sdk_self--buy_migme---callback");
    if (!buy_data) {
        console.log("sdk_self--buy_migme---buy_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(buy_data), function (str) {
            console.log("sdk_self.buy_migme str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "buy_migme") {
                var result = Number(ret_json.result); //回调结果码
                var result_data = ret_json.login_data;
                console.log("sdk_self--buy_migme---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}

//上传收益数据到appFlyer和valuepotion
//jsonData至少要包含{commodity_id : "1", channel_type:"sdk_vp"  //这个channel_type是支付类型，不是渠道,由服务器返回
//
// }
sdk_base.prototype.uploadRevenueData = function(jsonData){
    console.log("服务器获得的收益数据: "+ JSON.stringify(jsonData));
}

sdk_self.prototype.uploadRevenueData = function(jsonData){

    sdk_base.prototype.uploadRevenueData(jsonData);

    if(typeof thirdsdk.onlyfun == 'function'){
        var payData = jsonData.channel_type == "sdk_vp" ? this.googlePayData : global.data.tables["Pay"];
        var payItem;

        for (var key in payData){
            if(payData[key].channel_type == jsonData.channel_type && payData[key].commodity_id == jsonData.commodity_id){
                payItem = payData[key];
                break;
            }
        }

        if(!payItem){
            console.log("没有从支付列表 "+jsonData.channel_type +" 里找到支付成功返回的数据commodity_id : "+ jsonData.commodity_id);
            return;
        }

        //处理数据
        var data = {};
        data.fun_name = "revenue_data";
        data.revenue = payItem.money;
        data.content_id = payItem.commodity_id;
        data.currentcy = payItem.currency_type;
        var dataStr = JSON.stringify(data);
        console.log(" 要上传的收益数据: "+ dataStr);
        thirdsdk.onlyfun(dataStr,function(){});
    }

}
/**
*从本地的配置列表获取商品信息
*/
sdk_base.prototype.getSkuDetails = function(callBack){
    callBack();
}
/**
* 从google play 获取商品信息，商品信息在google service启动后获取
* @param callBack 获取成功后，返回结果的回调方法
*/
sdk_self.prototype.getSkuDetails = function(callBack){
     var self = this;
     console.log("查询google play配置的支付列表=====");
    //只有sdk_vp渠道的包，才需要去获取支付列表
    if(this.channel != "sdk_vp"){
        sdk_base.prototype.getSkuDetails(callBack);
        return;
    }else{
        //app版本号低于12也使用本地配置的支付列表
        if(Number(os.appversion()) < 19){
            sdk_base.prototype.getSkuDetails(callBack);
            return;
        }
    }
    var productIDList ;//需要提供productID(要与google play console配置的一致)
    var payData = global.data.tables["Pay"];

    var googlePayData = {};
    var productIDList = [];
    for(var key in payData){
        if(payData[key].channel_type == "sdk_vp"){
            googlePayData[key] = global.object.copyDeep(payData[key]);
            productIDList.push(googlePayData[key].commodity_id);
        }
    }
    var data = {};
    data.fun_name = "sku_details";
    data.productlist = productIDList;
    var dataStr = JSON.stringify(data);
    console.log("获取商品信息，参数:"+dataStr);
    thirdsdk.onlyfun(dataStr,function(backStr){
        callBack(JSON.parse(backStr).productlist);
    });
}
//新加migme货币购买元宝接口
sdk_self.prototype.migme_buy_gold  = function(buy_data,cb){

    console.log("sdk_self--migme_buy_gold---callback");
    if (!buy_data) {
        console.log("sdk_self--migme_buy_gold---buy_data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(buy_data), function (str) {
            console.log("sdk_self.migme_buy_gold str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "migme_buy_gold") {
                var result = Number(ret_json.result); //回调结果码
                var result_data = ret_json.login_data;
                console.log("sdk_self--migme_buy_gold---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}


//新加腾讯logout
sdk_self.prototype.txLogout  = function(data,cb){

    console.log("sdk_self--txLogout---callback");
    if (!data) {
        console.log("sdk_self--txLogout---data is undefined");
        return;
    }

    __needBackground(true);

    if (typeof (thirdsdk.onlyfun) == "function") {
        thirdsdk.onlyfun(JSON.stringify(data), function (str) {
            console.log("sdk_self.txLogout str:" + str);
            console.log("",str);
            if(str == undefined || str == ""){
                return;
            }

            var ret_json = JSON.parse(str);
            var fun_name = ret_json.fun_name;
            if (fun_name == "txLogout") {
                var result = Number(ret_json.result); //回调结果码
                var result_data = ret_json.login_data;
                console.log("sdk_self--txLogout---callback---result_data=%j",result_data);
                cb(result, result_data);
            }
        });
    }
}

//create
if (typeof thirdsdk == "undefined"){
    exports.sdkMannager = new sdk_base(false);
}else{
    exports.sdkMannager = new sdk_self(true);
}