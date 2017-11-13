
//common tips 

var node = {};

var cur_scene = null;
var origin_pos;
var obj_interval;
var up_num = 0;
var refresh_time = 100;
var total_time;

global.events.on('logout', function () {
    node.clean();
});

node.init = function () {

    //多语言label设置
    global.fn.setStringByIDInCurLanguage(node.sprite_beijing_2,"50055");//战力

    origin_pos = node.node_zhanlitisheng.getPosition();

    // create a holder
    var holder = cc.Node.create();
    this.addChild(holder)
    holder.setPosition(origin_pos);
    this.holder = holder;

    var members = ['sprite_beijing_1','sprite_beijing_2','ttf_wenzi_zhanli','ttf_wenzi_zhanlitisheng','ttf_wenzi_zhandoulixiajiang'];
    members.forEach(function (name) {
        var child = node[name];
        child.retain();
        child.removeFromParent();
        // child.setPosition(cc.POINT_ZERO);
        holder.addChild(child);
        child.release();
    });

    //show at common layer
    this.setZOrder(cc.zorderBase * cc.layer_common);
}

node.clean = function () {
    cur_scene = null;
    delete this._layerlv;
    global.one_old_power = 0;
    global.one_new_power = 0;
    up_num = 0;
}

node.show = function () {

    if (global.fn.loadui(global.res.ccbi(global.res.tips2), node)) {
        node.init();
    }
}

//创建计时器
node.create_interval = function(type)
{
  clearInterval(obj_interval);
  obj_interval = null;
  if (obj_interval == null) 
  {
    obj_interval = setInterval(function()
      {
        node.reset_power(type);
      },refresh_time);
  }
}

node.reset_power = function(type)
{
    total_time = total_time - refresh_time;
    global.one_old_power = Number(global.one_old_power) + Number(up_num);
    
    if(type == "1")
    {
        if(Number(global.one_old_power) >= Number(global.one_new_power))
            global.one_old_power = global.one_new_power;
    }else
    {
        if(Number(global.one_old_power) <= Number(global.one_new_power))
            global.one_old_power = global.one_new_power;
    }

    if(Number(global.one_old_power) <= 0)
        global.one_old_power = 0;

    node["ttf_wenzi_zhanli"].setString(parseInt(global.one_old_power));
    if(Number(total_time) <= 0)
    {
        node["ttf_wenzi_zhanli"].setString(parseInt(global.one_new_power));
        global.one_old_power = 0;
        global.one_new_power = 0;
        up_num = 0;
        clearInterval(obj_interval);
        obj_interval = null;
    }
    
}

exports.show_tips_2 = function (str1,str2, pos, t) {
    if(Number(global.one_new_power) == Number(global.one_old_power))
    {
        clearInterval(obj_interval);
        return;
    }
    if (t == undefined || t == null){
        t = 1.1;
    }
    total_time = t / 2 * 1000;
    if (cur_scene == null) {

        node.show();

        cur_scene = cc.Director.getInstance().getRunningScene();
        if (cur_scene) {
            cur_scene.addChild(node);
        }

    }
    else {

        var run_scene = cc.Director.getInstance().getRunningScene();

        if (run_scene != cur_scene) {

            cur_scene = run_scene;

            node.show();
            if (cur_scene) {
                cur_scene.addChild(node);
            }
        }

    }

    // if (typeof str === 'number') {
    //     str = global.fn.getConfigString ? global.fn.getConfigString(str) : str;
    // }
    if (pos == undefined) {
        pos = origin_pos;
    }

    // node.ttf_ziti.setString(str);
    if(str1 == undefined && str2 == undefined)
    {
        if(global.one_old_power != undefined && global.one_new_power != undefined)
        {
            var size;
            if(Number(global.one_new_power) > Number(global.one_old_power))
            {
                node["ttf_wenzi_zhanli"].setString(parseInt(global.one_new_power));
                size = node["ttf_wenzi_zhanli"].getContentSize();
                node["ttf_wenzi_zhanli"].setString(parseInt(global.one_old_power));
            }else
            {
                node["ttf_wenzi_zhanli"].setString(parseInt(global.one_old_power));
                size = node["ttf_wenzi_zhanli"].getContentSize();
            }
            

            
            var pos_zhanli = node["ttf_wenzi_zhanli"].getPosition();
            var new_x_1 = Number(pos_zhanli.x) - Number(size.width / 2) - 100;

            var new_pos_1 = cc.p(new_x_1,pos_zhanli.y);
            //战力 pos
            node["sprite_beijing_2"].setPosition(new_pos_1);
            var up_power = global.one_new_power - global.one_old_power;
            console.log("-----up_power----",up_power);
            node["ttf_wenzi_zhanlitisheng"].setVisible(Number(up_power) > 0);
            node["ttf_wenzi_zhandoulixiajiang"].setVisible(Number(up_power) <= 0);

            //控制 显示
            if(Number(up_power) > 0)
                node["ttf_wenzi_zhanlitisheng"].setString("+" + parseInt(up_power));
            if(Number(up_power) <= 0)
                node["ttf_wenzi_zhandoulixiajiang"].setString(parseInt(up_power));
            //增加、减少
            var new_x_2 = Number(pos_zhanli.x) + Number(size.width / 2) + Number(60);
            var new_pos_2 = cc.p(new_x_2,pos_zhanli.y);
            node["ttf_wenzi_zhanlitisheng"].setPosition(new_pos_2);
            node["ttf_wenzi_zhandoulixiajiang"].setPosition(new_pos_2);
            
        }
    }else
    {
        node["ttf_wenzi_zhanli"].setString(str1);
        node["ttf_wenzi_zhanlitisheng"].setString(str2);
    }
    
    //战力变化
    up_num = Number(global.one_new_power - global.one_old_power) / Number(total_time / refresh_time) ;
    //console.log("----up_num----",up_num);
    if(Number(global.one_new_power) > Number(global.one_old_power))
        node.create_interval(1);
    if(Number(global.one_new_power) < Number(global.one_old_power))
        node.create_interval(2);


    node.stopAllActions();
    node.holder.stopAllActions();
    node.holder.setPosition(pos);
    node.setVisible(true);

    node.runAction(cc.Sequence.create(cc.DelayTime.create(t), cc.Hide.create()));
    node.holder.runAction(cc.MoveBy.create(0.6, cc.p(0, 50)));
}
