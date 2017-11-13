
function sdk_stat() {
    this.url = "";
    this.path = {};

    this.appid = "";
    this.appkey = "";
    this.channel = "";

    this.device_info = {};
    this.account = {};
    this.role = {};
    this.payment = {};
}

sdk_stat.prototype.init = function(flag, channel){

    if(flag){
        this.url = "http://123.59.14.194:8080";
    }else{
        // test
        this.url = "http://120.132.72.92:8080";
    }
    
    this.path.device = "/data_gateway/api/device";
    this.path.account = "/data_gateway/api/account";
    this.path.role = "/data_gateway/api/role";
    this.path.payment = "/data_gateway/api/payment";

    this.appid = "10000008";
    this.appkey = "v2a6m7d8ww85va56xbjkcf9bhm0via3y";

    this.channel = channel;

    // 初始化完成即可发送stat_device
    this.stat_device();
}

sdk_stat.prototype.get_date = function(){
    var now = new Date();
    var y = now.getYear();
    var m = now.getMonth()+1;
    if(m < 10){
        m = "0" + m;
    }

    var d = now.getDate();
    if(d < 10){
        d = "0" + d;
    }

    var h = now.getHours();
    if(h < 10){
        h = "0" + h;
    }

    var mi = now.getMinutes();
    if(mi < 10){
        mi = "0" + mi;
    }

    var s = now.getSeconds();
    if(s < 0){
        s = "0" + s;
    }

    return y+m+d+h+mi+s;
}

sdk_stat.prototype.stat_device = function(){
    var self = this;

    var device = {};
    // 唯一码
    device.deviceId = os.mac();
    // 操作系统
    device.osType = os.platform();
    
    // SDK版本
    device.osVersion = os.version();
    // 分比率
    device.resolution = "unknown";
     // 机型
    device.brandModel = os.machine();

    // 本地IP
    device.ip = "127.0.0.1"; // 暂时 
    // app 版本
    device.appVersion = os.appversion();
    
    // 网络
    if(os.netstate() == os.NET_MOBILE){
        device.network = "2G/3G"
    }else if(os.netstate() == os.NET_WIFI){
        device.network = "wifi";
    }
    // 运营商
    device.operator = "unknown";


    self.device_info = device;

    self.send_msg("device");
}

sdk_stat.prototype.set_ip = function(ip){
    if(ip){
        this.device_info.ip = ip;
    }
}

sdk_stat.prototype.stat_account = function(account){
    var self = this;
    self.account.accountId = account.accountId;
    if(account.accountName){
        self.account.accountName = account.accountName;
    }else{
        self.account.accountName = account.accountId;
    }

    self.send_msg("account");
}

sdk_stat.prototype.stat_role = function(role){
    var self = this;
    self.role.roleId = role.roleId;
    self.role.roleName = role.roleName;
    self.role.serverName = role.serverName;
    self.role.level = role.level;

    self.send_msg("role");
}

sdk_stat.prototype.stat_payment = function(payment){
    var self = this;

    self.payment.orderId = payment.orderId;
    self.payment.payChannel = payment.payChannel;
    self.payment.payCompany = payment.payCompany;
    self.payment.payType = payment.payType;
    self.payment.currencyType = payment.currencyType;
    self.payment.currencyAmount = payment.currencyAmount;
    self.payment.virtualAmount = payment.virtualAmount;
    self.payment.iapId = payment.iapId;
    self.payment.level = payment.level;
    self.payment.mission = payment.mission;
    self.payment.unionName = payment.unionName;
    self.payment.unionLevel = payment.unionLevel;

    self.send_msg("payment");
}

sdk_stat.prototype.get_sign_msg = function(type){
    var self = this;
    
    var msg = {};
    var sign_before = "";

    if(type != "payment"){
        if(type == "account"){
            
            msg.accountId = self.account.accountId+"";
            msg.accountName = self.account.accountName+"";
            
            sign_before = self.account.accountId + "#" + self.account.accountName + "#";
            
        }

        if(type == "role"){
            
            msg.roleId = self.role.roleId+"";
            msg.roleName = self.role.roleName+"";
            msg.serverName = self.role.serverName+"";
            msg.accountId = self.account.accountId+"";
            
            sign_before = self.role.roleId + "#" + self.role.roleName + "#" + self.role.serverName + "#" + self.account.accountId + "#";
        }
        
        msg.deviceId = self.device_info.deviceId+"";
        msg.appId = self.appid+"";
        msg.appVersion = self.device_info.appVersion+"";
        msg.channel = self.channel+"";
        msg.ip = self.device_info.ip+"";
        msg.network = self.device_info.network+"";
        msg.operator = self.device_info.operator+"";
        msg.osType = self.device_info.osType+"";
        msg.osVersion = self.device_info.osVersion+"";
        msg.resolution = self.device_info.resolution+"";
        msg.brandModel = self.device_info.brandModel+"";
        msg.registerDate = self.get_date()+"";
        msg.loginDate = self.get_date()+"";
        

        sign_before += self.device_info.deviceId +
                        "#" + self.appid + 
                        "#" + self.device_info.appVersion + 
                        "#" + self.channel + 
                        "#" + self.device_info.ip + 
                        "#" + self.device_info.network + 
                        "#" + self.device_info.operator + 
                        "#" + self.device_info.osType + 
                        "#" + self.device_info.osVersion +  
                        "#" + self.device_info.resolution +  
                        "#" + self.device_info.brandModel + 
                        "#" + self.get_date() + 
                        "#" + self.get_date() + 
                        "#" + self.appkey;
    }else{
        
        msg.roleId = self.role.roleId+"";
        msg.serverName = self.role.serverName+"";
        msg.accountId = self.account.accountId+"";
        
        msg.deviceId = self.device_info.deviceId+"";
        msg.appId = self.appid+"";
        msg.appVersion = self.device_info.appVersion+"";
        msg.channel = self.channel+"";
        msg.ip = self.device_info.ip+"";
        msg.network = self.device_info.network+"";
        msg.operator = self.device_info.operator+"";
        msg.osType = self.device_info.osType+"";
        msg.osVersion = self.device_info.osVersion+"";
        msg.resolution = self.device_info.resolution+"";
        msg.brandModel = self.device_info.brandModel+"";
        
        msg.orderId = self.payment.orderId+"";
        msg.orderDate = self.payment.orderDate+"";
        msg.payChannel = self.payment.payChannel+"";
        msg.payType = self.payment.payType+"";
        msg.currencyType = self.payment.currencyType+"";
        msg.currencyAmount = self.payment.currencyAmount+"";
        msg.virtualAmount = self.payment.virtualAmount+"";
        msg.iapId = self.payment.iapId+"";
        msg.level = self.payment.level+"";
        msg.mission = self.payment.mission+"";
        msg.unionName = self.payment.unionName+"";
        msg.unionLevel = self.payment.unionLevel+"";
        

        sign_before += self.role.roleId + 
                        "#" + self.role.roleserverName + 
                        "#" + self.account.accountId +
                        // device info
                        "#" + self.device_info.deviceId + 
                        "#" + self.appid + 
                        "#" + self.device_info.appVersion + 
                        "#" + self.channel + 
                        "#" + self.device_info.ip + 
                        "#" + self.device_info.network + 
                        "#" + self.device_info.operator + 
                        "#" + self.device_info.osType + 
                        "#" + self.device_info.osVersion +  
                        "#" + self.device_info.resolution +  
                        "#" + self.device_info.brandModel + 
                        // pay info
                        "#" + self.payment.orderId + 
                        "#" + self.payment.orderDate + 
                        "#" + self.payment.payChannel + 
                        "#" + self.payment.payCompany + 
                        "#" + self.payment.payType + 
                        "#" + self.payment.currencyType + 
                        "#" + self.payment.currencyAmount + 
                        "#" + self.payment.virtualAmount + 
                        "#" + self.payment.iapId + 
                        "#" + self.payment.level + 
                        "#" + self.payment.mission + 
                        "#" + self.payment.unionName + 
                        "#" + self.payment.unionLevel + 

                        "#" + self.appkey;

    }
    

    //console.log("",sign_before);
    
    var hex_md5 = require("../game_lib/md5").hex_md5;
    
    var sign = hex_md5(sign_before);

    //console.log("",sign);
    
    //msg += "&sign=" + sign;

    msg.sign = sign.toUpperCase();
    
    return msg;
}

sdk_stat.prototype.send_msg = function(type){
    var self = this;
    var path = self.url + self.path[type];
    var msg = self.get_sign_msg(type);
    var data = [];
    data.push(msg);

    //var full_host = path + msg;
    console.log("------------- sdk_stat ----------------");
    //console.log("",path);
    var buf = JSON.stringify(data);

    var http = require("../lib/http");
    http.post(path, buf, function (ret) {
        console.log("----------- send sdk stat recv -----------");

        console.log(""+JSON.stringify(ret));
    });
    
    /*
    var req = http.post(path, function(ret){
        console.log("----------- send sdk stat recv -----------");
                        
        console.log(JSON.stringify(ret));

    });
    var buf = JSON.stringify(data);

    console.log(buf);

    req.write(buf);
    req.end();*/
}

/*
    log_data = {};
    log_data.acc = "";
    log_data.role_info = {};    // 如果登录，创建角色日志role_info可以为空
    log_data.role_info.grid = 0;
    log_data.role_info.name = "";
    log_data.role_info.level = "";
    log_data.server_id = "";
    log_data.type = 0;      // 行为类型
    log_data.action = {};   // 行为内容，根据具体统计的内容动态添加
*/
sdk_stat.prototype.send_log = function (log_data) {
    var self = this;

    //var path = "http://sg.game.75wan.cn:30020/client_log";

    var path = "http://" + global.data.game_login.serverip + ":" + 30020 + "/client_log";

    var hex_md5 = require("../game_lib/md5").hex_md5;
    var sign = hex_md5(log_data);

    log_data.sign = sign;

    console.log("------------- log ----------------");
    console.log("send_log---",path);
    var buf = JSON.stringify(log_data);

    var http = require("../lib/http");
    http.post(path, buf, function (ret) {
        console.log("----------- send log server recv -----------");

        console.log(""+JSON.stringify(ret));
    });
}

exports.statMannager = new sdk_stat();
