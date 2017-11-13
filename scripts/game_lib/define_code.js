
var msg_billing = require("./msg_billing");
var msg_game = require("./msg_game");

//-----------------------------------
// 登录类型
function LoginType()
{
    this.LT_BP              = 0;    // use bphero accout password login
    this.LT_FREE            = 1;    // use mobile deviceUniqueIdentifer login
    this.LT_GAMECENTER      = 2;    // use gamecenter account
    this.LT_QQ              = 4;    // use qq accout password login
    this.LT_WEIBO           = 5;    // use xinlang-weibo accout password login
    this.LT_RENREN          = 6;    // use ren-ren accout password login
    this.LT_91              = 7;
}

//-----------------------------------
// 登录返回值
function LoginCode()
{    
    this.LC_SUCC                  = 0;
    this.LC_ACC_PWD_ERROR         = 1;
    this.LC_OTHER_ERROR           = 2;
    this.LC_NEED_REGISTER         = 3;
    this.LC_ACCOUNT_EXIST         = 4;
    this.LC_MODIFY_PASSWORD_OK    = 5;
    this.LC_SOMEBODY_LOGIN        = 6;
    this.LC_IS_ONLINE             = 7;
    this.LC_REGISTER_OK           = 0;
    this.LC_ROLE_EXIST            = 9;
    this.LC_ACC_EMPTY             = 10;
    this.LC_ACC_PWD_EMPTY         = 11;
    this.LC_ACC_OR_PWD_ERROR      = 12;
    this.LC_ACC_MODE_ERROR        = 13;
    this.LC_PHONE_MODE_ERROR      = 14;
    this.LC_EMAIL_MODE_ERROR      = 15;
}
//-----------------------------------
// 发送消息code字段
function MsgCode()
{
    this.SUCCESS                          = 0;  // 操作成功
    this.FAIL                             = -1; // 操作失败
    this.ROLE_MONEY_ENOUGH                = 1;  // 银币不足
    this.ROLE_GOLD_ENOUGH                 = 2;  // 元宝不足
    this.POINT_NOT_ENOUGH                 = 36; //体力不足
    this.ITEM_DATA_ERROR                  = 39; // 道具数据错误
    this.ENGAGE_DATA_ERROR                = 40; // 卡牌数据错误
    this.FORMATION_ERROR                  = 41;
    this.EQUIP_DATA_ENOUGH                = 42; // 装备数据错误
    this.CANNOT_FIGHT                     = 43;
    this.IDENTIFY_ERROR                   = 44;
    this.ROLE_LEVEL_LOW                   = 46;  // 进入国战的等级不够
    this.PVP_ROKENS_NOT_ENOUGH            = 50;  //
    this.MARCH_ROKENS_NOT_ENOUGH          = 51;  //

    this.WORDS_NOT_ALLOW                  = 98;  // 用词不当
    this.EQUIP_CHIP_NOT_ENOUGH            = 99;  // 装备碎片不足
    this.EQUIP_CHIP_DATA_ERROR            = 100; // 装备碎片数据错误
    this.PVP_DATA_ERR                     = 101; // 竞技场数据错误
    this.PVP_OPEN_LEVEL_ENOUGH            = 102; // 竞技场开放等级不足
    this.PVP_FIGHT_INTEGRAL_ENOUGH        = 103; // 竞技场兑换积分不足
    this.PVP_REFRESH_NUM_ENOUGH           = 104; // 竞技场挑战次数不足
    
    this.PVP_NO_FIGHT_MYSELF              = 105; // 不能挑战自己
    this.PVP_MYSELF_FORM_ENOUCH           = 106; // 自己的进攻阵型数据错误
    this.PVP_FORMATION_ENOUCH             = 107; // 敌人阵型数据错误
    this.PVP_BUY_FIGHT_ENOUCH             = 108; // 购买挑战的次数不足
    this.EQUIP_WEAR_ERROR                 = 109; // 装备穿戴错误
    this.EQUIP_WEAR_PLACE_ERROR           = 110; // 装备穿戴的槽位错误
    this.EQUIP_BINDING_ERROR              = 111; // 装备绑定卡牌失败
    this.EQUIP_DELETE_ERROR               = 112; // 装备删除错误
    this.EQUIP_LEVEL_EXCEED               = 113; // 装备穿戴等级超出卡牌等级

    //签到
    this.SIGN_DATA_ERROR                  = 125; // 签到数据错误
    this.SIGN_DAYS_ERROR                  = 126; // 签到的天数错误
    this.SIGN_REWARD_ALREADY              = 127; // 该签到的物品已领取

    this.SWEEP_ITEM_NOT_ENOUGH            = 130; // 扫荡劵不足
    this.FIGHT_TIMES_NOT_ENOUGH           = 131; // 战斗次数不足
    this.CONSORTIA_NAME_REPEAT            = 150; // 公会名字重复
    this.COOLING_NOT_REACH                = 152; // 冷却时间未到
    this.NOT_HAVE_PERMISSION              = 154; // 玩家木有权限
    this.CONSORTIA_APPLY_LIMIT            = 160; // 公会申请人数达上限
    this.CONSORTIA_NAME_IS_LIMIT          = 161; //公会名字过长
    this.NO_ATTACK_AUTH                   = 164; // 没有攻击权力
    this.TIME_QUANTUM_ERROR               = 169; // 该时间段不能干这件事

    this.NOT_HAS_DEFENSETEAM              = 170; // 玩家没有防守阵型
    this.MOVE_NOT_COOLING                 = 173;  // 疲劳中
    this.CANNOT_GET_SITUATION             = 175; // 非战斗阶段不能请求战况
    this.COOLING_TIME_ERROR               = 176; // 冷却时间有错误,可能客户端需要返回到大界面
    this.NEED_REFRESH_MATCH               = 177; // 该玩家刚才被干掉了，请刷新  需要重新请求
    this.HAS_NO_MONSTER                   = 178; // 没有这个怪物了
    this.NO_PLAYER_OR_DIE                 = 179; // 该玩家被干掉了或者根本没有这个玩家在怪上
    this.TOWER_REPAIR_LIMIT_NUM           = 180; // 修复次数已经最大
    this.REFRESH_TIMES_LIMIT              = 187; // 刷新次数上限
    this.ENERGY_NOT_ENOUGH                = 192; // 精力不足
    this.SCIENCE_JSON_NO_POINT            = 193; // 公会科技JSON没有这个点
    this.SCIENCE_ALREADY_UNLOCK           = 194; // 科技已经激活
    this.UNLOCK_RES_NOT_ENOUGH            = 195; // 激活所需资源不够
    this.UNLOCK_CONDITION_NOT_ENOUGH      = 196; // 激活条件不足
    this.CURRENCY_NOT_ENOUGH              = 197; // 公会货币不足
    this.DATA_ERROR                       = 200; // 数据错误
    this.ROLE_NAME_IS_LIMIT               = 228; // 角色名字过长
    this.CONSORTIA_THE_POSITION_LIMIT     = 262; // 公会该职位人数达上限
    this.BUY_POINT_IS_LIMIT               = 280; // 当前体力已达到购买的上限
    this.BUY_POINT_NUM_NOT_ENOUGH         = 281; // 今日购买体力的次数已用完
    this.RECEIVE_POINT_NOT_TIME           = 282; // 领取体力时间还未到
    this.RECEIVE_POINT_TIME_IS_LIMIT      = 283; // 领取体力时间已过
    this.RECEIVE_POINT_IS_RECEIVE         = 284; // 今日已领取过该体力
    this.CARDS_IS_ALL_DEAD                = 290; // 卡牌全部阵亡

    this.REWARD_CANNOT_RECV         = 301;
    this.NOT_HAVE_TASK              = 310; //任务不存在
    this.TASK_NOT_EXIST             = 311; //任务不存在
    this.TASK_ALREADY_RECV          = 312; //已经领取
    this.TASKSCORE_ALREADY_RECV     = 313; //积分奖励已经领取
    this.TASKSCORE_NOT_ENOUGH       = 314; //积分不够
    this.TASKSCORE_NOT_EXIST        = 315; //积分奖励不存在
    this.TASK_NOT_COMPLETE          = 316; //任务没有完成
    this.TASK_RECV_TIME_LIMI        = 317; //不在领取时间范围内
    this.CARD_REBIRTH_CANOT_LEVEL_UP = 318;// 英雄不满足转生条件

    this.ITEM_NOT_ENOUGH            = 401;//道具不足
    this.EQUIP_NOT_OPEN             = 402;//装备未开启
    this.EQUIP_QUALITY_NO_ENOUGH    = 403;//装备品质不足
    this.EQUIP_STRA_HIGHEST         = 404;//装备没有下一星级 最高星


    this.ITEM_BUY_NUM_BUDGET        = 405;//超过购买数量 
    this.ITEM_ADD_ERROR             = 406;//增加道具错误

    this.COMBAT_COOLING_TIME        = 410;//战斗冷却时间未到
    this.TIME_EXTRACT_FREETIME_NOT  = 411;//装备免费抽取已无 

    this.EQUIP_QUALITY_MAX          = 413;//装备品质 最高
    this.EQUIP_STRA_MAX             = 414;//装备星数 最高
    this.JSON_TABLE_LACK            = 415;//表格数据缺失

    this.VIP_DATA_UNDEFINED         = 419;//客户端数据发送数据undefined
    this.VIP_BUY_VALUE_MAX          = 420;// 购买vip已经到达最大值
    this.CARBON_NOT_OPEN            = 421;  //挑战副本未通关
    this.GIFT_HAVE_GET              = 422;  //挑战副本已经领取
    this.JSON_DATA_UNDEFINED        = 423;  //json数据是undefined
    this.CARBON_TYPE_ERRO           = 424;  //挑战副本类型不对 1，普通副本，2精英副本
    this.SKILL_POINT_NOENGOUTH      = 425;  //技能点延迟时间，没有到达1的基础技能点
    this.ITEM_CAN_NOT_BUY           = 426; // 此道具不能购买
    this.GAME_CODE_NOT_EXSIT        = 427;  //此激活码不存在
    this.GAME_CODE_EXPIRE           = 428;  //激活码已经过期
    this.MOBILE_LENGTH_ERRO         = 429;  //手机号码长度不对
    this.MOBILE_NUMBER_ERRO         = 430;  //手机号码不对
	//-------------------------------------------------yangyuzhou 2016/3/30 20:15
	this.PAST_RECEIVE 				= 431;  //激活码已经领取过了
	this.CODE_TYPE_REPEAT 			= 432;  //激活码不能重复领取同类型
	//--------------------------------------------------------
	
    this.SKIPPASS_OVER_CUR          = 433;  //关卡超过了现在能跳过的关卡
    this.TODAY_HAVE_SIGN            = 435;  //今天已经签到
    this.NO_PVP_DATA                = 436;  //没有pvp数据


    this.FIRST_PAY_HAVE_GET         = 438;  //首充奖励已经领取
    this.NOT_FIRST_PAY              = 439;  //没有进行过充值

    this.KMD_TIME_NOT_ENOUGH        = 442;  //孔明灯的次数不足
    this.KMD_ITEM_NOT_CASH          = 443;  //孔明灯:此碎片不能兑换
    this.KMD_BUY_TINE_NOT_ENGOUGH   = 444;  //孔明灯:购买许愿次数不足

    this.ADD_UP_MONEY_NOT_ENGOUGH = 445;  //累计充值：充值钱数不足
    this.HAVE_GET_RECRUIT_REWARD = 449;  //招募英雄：活动奖励已经领取

    this.ITEM_NOT_EXCHANGE = 450;          //道具不能兑换
    this.EXCHANGE_NUM_MAX = 451;            //对话数量已经最大值

    this.GUILD_SIGN_NOT_ENOUGH = 470;// 公会签到进度不足
    this.GUILD_SIGN_BOX_RECIEVED = 471;// 公会签到宝箱已经领取
    this.GUILD_SIGN_COUNT_LIMIT = 472;// 公会签到次数已满

    this.GUILD_WORSHIP_SECOND_DAY = 474;//公会 第二天开启
    this.GUILD_SIGH_NOT_OPEN    = 475;//公会签到开启条件不足
    this.GUILD_WORSHIP_NOT_OPEN  = 476;//公会膜拜开启条件不足
    this.GUILD_WORSHIP_SAME_OME = 477;//每天只能膜拜一个人
    this.GUILD_LEVEL_MAX        = 478;//公会已经达到最高等级

    this.GUILD_JOIN_NO_FOUND    = 479;//没有找到可以快速加入的公会
    this.GUILD_SEARCH_NO_FOUND  = 480;//没有查询到你要的公会
    this.CONSUME_GOLD_NOT_ENOGH = 483 ;//累计消费元宝不足
    this.CONSUME_GOLD_NOT_REWAED = 484;//累计消费 奖励已经领取
    this.CLIENT_DATA_ERROR          = 500;  // 客户端数据错误 
    this.CARD_NOT_EXIST             = 501;  // 卡牌不存在
    this.ITEM_NOT_EXIST             = 502;  // 道具不存在
    this.EQUIP_NOT_ENOUGH           = 503;  // 装备未集齐
    this.ITEM_NOT_ENOUGH            = 504;  // 道具不足
    this.CARD_CANOT_LEVEL_UP        = 505;  // 卡牌不可升级
    this.CARD_STAR_CANOT_LEVEL_UP   = 506;  // 卡牌不可升星
    this.CARD_CANOT_EVOLUTION       = 507;  // 卡牌不可进阶
    this.CARD_CANOT_COMBINE         = 508;  // 卡牌不可合成

    this.HERO_CARD_NOT_FOUND            = 510; // 英雄卡牌不存在
    this.HERO_CARD_SKILL_LEVEL_IS_MAX   = 511; // 英雄卡牌技能等级已满
    this.HERO_CARD_SKILL_NOT_FOUND      = 512; // 技能不存在
    this.SKILL_POINTS_NOT_ENOUGH        = 513; // 技能点不够
    this.SKILL_BUY_POINTS_NOT_ENOUGH    = 514; // 购买技能点的次数不够

    this.HEAD_NOT_EXIST             = 520;  // 头像不存在
    this.HEAD_FRAME_NOT_EXIST       = 521;  // 头像框不存在
    this.HEAD_CARD_NOT_UNLOCK       = 522;  // 还没获得此卡牌
    this.HEAD_NOT_GET               = 523;  // 没有获得该奖励头像
    this.PLAYER_NAME_REPEAT         = 524;  // 玩家名字重复
    this.HEAD_FRAME_NOT_GET         = 525;  // 没有获得该奖励头像框

    //远征
    this.NM_EXPEDITION_IS_GET         = 530;//远征:已领取当前组奖励
    this.NM_EXPEDITION_NOT_RESET_NUM  = 531;//远征：重置次数已达上限
                                            //532 已经通关

    this.NM_ARMYCORPS_IS_MAX       = 540;//
    this.NM_ARMYCORPS_NAME_REPEAT  = 541;//
    this.NM_ARMYCORPS_NOT_FOUND    = 542;//

    //vip相关
    this.NM_VIP_NOT_ENOUGH         = 543;//vip等级不够

     //chat
    this.NM_ROLE_OFF_LINE          = 544;//角色不在线

    //公会生产
    this.GUILD_PRODUCTING_IS_LIMIT               = 560;//公会生产队列已达上限
    this.GUILD_PRODUCTING_IS_NUM_MAX             = 561;//公会生产单位数量已达上限
    this.GUILD_PRODUCTING_IS_SHOP_BUY            = 562;//公会生产单位正在公会商店出售
    this.GUILD_PRODUCTING_CONSUME_NOT_ENOUGH     = 563;//消耗材料不足
    this.GUILD_PRODUCTING_IS_PRODUCT             = 565;//商品正在生产


    this.GUILD_SHOP_IS_BUY_LIMIT              = 570;//公会商店此物品已达购买上限
    this.GUILD_SHOP_IS_CONSUME_ENOUGH         = 571;//公会商店购买物品消耗不足
    this.GUILD_SHOP_IS_COMMODITY_ENOUGH       = 572;//公会商店购买的物品数量不足
    this.SHOP_HAVE_GET                        = 573;//已经领取奖励 
    this.SHOP_GETGIFT_CONDITION_NOT_ENOUGH    = 574;//领取条件不足
    this.EXTRACT_USE_NUM_MAX = 863; // 抽卡补充：今天的使用数量达上限

    this.GUILD_SCIENCE_NOT_UNLOCK             = 564;//科技点未激活

    this.PVP_AWARD_HAS_GOT = 610;     // pvp奖励已领取
    this.PVP_AWARD_CANT_GOT = 611;    // pvp奖励未达领取条件
    this.PVP_FIGHT_CD = 612;          // pvp战斗cd中
    this.SHENBING_ORI = 701;       // 初始状态 无法还原
    this.SHENBING_HUANYUAN_LIMIT = 702;       // 初始状态 无法还原

    this.HERO_QUALITY_NOT_ENOUGH = 740;    //英雄品质不足，不能重生
    this.HERO_LEVEL_NOT_ENOUGH = 741;    //英雄等级不足，不能重生
    this.HERO_SKILL_LEVEL_NOT_ENOUGH = 742;    //英雄技能等级不足，不能重生

    
    
    this.CODE_TYPE_UPPERLIMIT = 750;    //该类型的礼物码，已经到达上线

    this.HERO_DEFEND_MONSTER_OTHER_CITY = 760;      //正在其他城市上车中
    this.HERO_DEFEND_MONSTER_SQUEEZED_OUT = 761;      //不能 被其他人 挤掉同一个车位

    this.CHALL_CARBON_FROMATION_FEMALE = 766; //当前副本只能上 女性卡牌
    this.CHALL_CARBON_FROMATION_MALE = 767; //当前副本只能上 男性
    this.CHALL_CARBON_FROMATION_NOT_OPEN = 768; //副本未开启

    this.CARD_FIGHT_REFRESH_LEVELS_MAX = 775;        // 群英会刷新挑战英雄次数到上限
    this.CARD_FAVOUR_LINE_LEVEL_MAX = 776;     //名人堂 等级已经达到最大

    this.EXP_EXCHANGE_LV = 800;      // 交易等级不够
    this.EXP_EXCHANGE_EXP = 801;     // 玩家exp为0
    this.EXP_EXCHANGE_ITEM = 802;    // 购买商品有误
    this.EXP_EXCHANGE_EXP2 = 803;    // 玩家exp不足

    this.REBIRTH_ITEM = 805;// 转生消耗物品不足
    this.CAISHENDAO_DEFECT = 839;       // 老虎机：数据表缺失
    this.CAISHENDAO_ROLE_DEFECT = 840;       // 老虎机：个人数据缺失
    this.CAISHENDAO_RANDOM_FAIL = 841;       // 老虎机：随机失败
    this.GET_REWARD_MAX = 843;                // 单笔充值：领取数已经是最大值
    this.PAY_NUM_NOTENOUGH = 844;                // 单笔充值：充值条件不足


    this.WORLD_BOSS_ROLE_DEFECT = 845;                      // 世界boss，缺少个人数据
    this.WORLD_BOSS_NUM_SHORT = 846;                        // 世界boss,次数不足
    this.WORLD_BOSS_LEVEL_SHORT = 847;                    // 世界boss,等级不足
    this.WORLD_BOSS_TYPE_ERROR = 848;                     // 世界boss,发送类型不对
    this.WORLD_BOSS_NOT_OPEN = 849;                       // 世界boss,活动未开启
    this.WORLD_BOSS_LEVEL_FAIL = 850;                     // 世界boss,关卡不对
    this.WORLD_BOSS_BUFF_LIMIT = 851;                     // 世界boss,购买BUFF已经达到上限
    this.JSON_DATA_NOT_EXIST = 852;                       // 策划表格缺少数据，请补全。（提示：数据不存在，请检查数据）
    this.WORLD_BOSS_LEVEL_NOT_PASS = 853;                 // 世界boss关卡未通关
    this.WORLD_BOSS_HAVE_GET_REWARD = 854;                // 世界boss关卡礼包已经领取
    this.WORLD_BOSS_NOT_GET = 855;                        // 世界boss关卡没有礼包可以领取
    this.WORLD_BOSS_SETTING_ERRO = 856;                   // 世界boss关卡设置错误
    this.WORLD_BOSS_MONEY_LACK = 857;                     // 世界boss,boss币不足
    this.WORLD_BOSS_FIGHT_MAX = 858;                     // 世界boss,购买战斗次数到上线
    this.WORLD_BOSS_FIGHT_CHECK = 859;                     // 世界boss,数据验证失败，怀疑有作弊行为

    this.OPERATE_ROLE_DATA_NON_EXIST = 872;               // 运营活动：个人活动数据不存在
    this.LOSE_SIGN_TOP = 900;    // 超过vip补签上限
    this.LOSE_SIGN_COUNT = 901;    // 超过最大可补签次数
    this.LOSE_SIGN_COST = 902;    // 钻石不足
    this.LOSE_SIGN_ERROR = 903;    // 补签参数错误

    this.GUILD_RANK_REWARD_DICE_ITEM_MAX = 910;//投掷 道具种类 达到上限
    this.GUILD_RANK_REWARD_APLLY_ITEM_MAX = 911;// 申请道具种类 达到上限
    this.GUILD_RANK_REWARD_DICE_ITEM_ALREADY = 912;// 此道具 已经投掷过
    this.GUILD_RANK_REWARD_APLLY_ITEM_ALREADY = 913;//次道具  已经申请过
    this.GUILD_RANK_REWARD_TIME_IS_OVER = 914; //已经过了设置分配的时间
    this.GUILD_RANK_REWARD_IS_NOT_TIME = 915; // 还没有到 投筛子 和 申请时间

    this.LV_REWARD_1 = 1000;// 等级礼包基本数据出错
    this.LV_REWARD_2 = 1001;// 领取礼包等级不足
    this.LV_REWARD_3 = 1002;// 等级礼包已领取
    this.LV_REWARD_4 = 1003;// 参数错误



    this.PERSON_SCIENCE_2 = 1011;// 个人科技章节未开启
    this.PERSON_SCIENCE_3 = 1012;// 科技点未开启/激活
    this.PERSON_SCIENCE_5 = 1014;// 科技点不存在
    this.PERSON_SCIENCE_6 = 1015;// 激活消耗不足
    this.PERSON_SCIENCE_7 = 1016;// 激活消耗不足
    
    this.WEAPON_ACTIVE_2 = 1021;// 神器开启条件不足
    this.WEAPON_CULTIVATE_3 = 1022;// 神器未开启
    this.WEAPON_CULTIVATE_4 = 1023;// 培养神器消耗不足
    
    this.CARBON_ERROR = 1030;// 3星领奖参数错误
    this.WEAPON_CANNOT_GET = 1031;// 不可领取奖励


    this.SOUL_ERROR_1 = 1040;// 参数错误
    this.SOUL_ERROR_2 = 1041;// 卡牌不存在
    this.SOUL_ERROR_3 = 1042;// 背包物品不足
    this.SOUL_ERROR_4 = 1043;// 钻石不足
    this.SOUL_ERROR_5 = 1044;// vip不够
    this.SOUL_ERROR_6 = 1045;// 已满级
    this.SOUL_ERROR_7 = 1046;// 金币不足
    this.SOUL_ERROR_8 = 1047;// 战魂总等级不足
    this.SOUL_ERROR_9 = 1048;// 消耗不足
    this.GUILDSCORE_1 = 1074;// 参数错误
    this.GUILDSCORE_2 = 1075;// 玩家数据错误
    this.GUILDSCORE_3 = 1076;// 任务已完成
    this.GUILDSCORE_4 = 1077;// 积分不足
    this.GUILDSCORE_5 = 1078;// 奖励已领取
    this.ERROR_PROTECT = 2100;//保护符数据有误
    this.ERROR_LUCK = 2101;//幸运符数据有误
    this.ESSENCE_NOT_ENOUGE = 2102;//精华不足
    this.RUNE_UN_EXIST = 2103;//符文不存在
    this.RUNE_BEST = 2104;//最高品质，不可合成
    this.MATERIAL = 2105;//合成材料不足
    this.ERROR_MATERIAL = 2106;//合成材料品质不统一
    this.ERROR_PARAM = 2107;//参数有误
    this.NOT_SURPASS	= 2108;//不允许超过一键强化的最大等级
    this.UN_EXIST_OR_ADORN = 2109;//符文不存在或已经装备
    this.EX_RUNE_PRO_NOT_ENOUGH = 2150; //道具不足
    this.EX_RUNE_NOT_GOLD       = 2151; //元宝不足
    this.EX_RUNE_DATA_ERROR		= 2152; //数据错误
    this.EX_RUNE_ADD_RUNE      = 2153; //添加符文失败
    this.EX_RUNE_LIVE          = 2154; //等级不足
    this.EX_RUNE_DAY_MAX       = 2155; //抽卡次数达到上限
    this.EX_RUNE_ADD_REW       = 2156; //添加额外奖励失败

    //双子塔相关
    this.GEMINI_DATA = 2250;//双子塔各项协议的数据格式错误
    //双子塔战斗相关错误码
    this.GEMINI_NOT_COUNT = 2251;           //挑战次数不足
    this.GEMINI_NOT_FIND_LEVEL = 2252;      //关卡不存在
    this.GEMINI_NOT_PASS_PREV = 2253;       //没有通过前一个关卡
    this.GEMINI_NOT_LEVEL = 2254;           //军团等级不足
    this.GEMINI_NOT_FINIHSH_LEVEL = 2255;   //没完成之前的关卡（切换关卡）
    this.GEMINI_HAS_FIGHT_LEVEL = 2256;     //重复关卡
    this.GEMINI_REPEAT_CARD_IN_TEAM = 2257; //重复的上阵卡牌

    this.GEMINI_BUY_HIGH = 2258;            //购买次数达到上限
    this.GEMINI_GOLD_NOT_ENOUGH = 2259;     //元宝不足

    //领取层奖励
    this.GEMINI_NOT_REPEAT_GET = 2260;      //重复领取
    this.GEMINI_NOT_PASS_ALLLEVEL = 2261;          //没有通关本层所有关卡

    //获取通关详情
    this.GEMINI_RANK_NOT_IN_RANK = 2262;    //数据不存在
} 
//-----------------------------------
// 平台类型
function PlatformType()
{
    this.PLATFORM_DESKTOP       = 0;
    this.PLATFORM_IOS           = 1;
    this.PLATFORM_ANDROID       = 2;
    this.PLATFORM_WIN_WEBPLAYER = 3;
    this.PLATFORM_OSX_WEBPLAYER = 4;
    this.PLATFORM_WEB           = 5;
}

//------------------------------------
// 常量定义
function ConstValue()
{
    this.MAX_BROKERAGE_STORE_COUNT = 8;
    this.MAX_ENGAGE_BAG_COUNT = 5;
    this.MAX_ENGAGE_TEAM_COUNT = 2;
    this.MAX_ENGAGE_STORE_REFRESH_TIME = 7200;	// 7200; 佣兵商店刷新卡时间
    this.MAX_EQUIP_STORE_REFRESH_TIME = 7200;  // 7200; 装备商店刷新卡时间
    this.MAX_TASK_STORE_COUNT = 5;
    this.MAX_TASK_STORE_REFRESH_TIME = 7200;	// 7200; 酒店任务刷新卡时间
    this.MAX_TASK_NORMAL_BAG_COUNT = 5;		// 任务空间
    this.MAX_TASK_ALL_BAG_COUNT = 99;		// 任务空间
    this.SAVE_DB_TIME = 10;			// 定时存储用户数据
    this.MAX_EQUIP_BAG_COUNT = 100;		// 角色装备背包空间
    this.MAX_ITEM_COUNT = 10;			// 角色道具背包空间
    this.MAX_ITEM_UNIT_COUNT = 999;		// 每种道具堆叠数量
    this.MAX_TASK_NORMAL_COUNT = 25;		// 每天完成普通任务数量
    this.MAX_RANK_REFRESH_TIME = 120;		// 竞技场竞技时间
    this.MAX_ROLE_LEVEL = 40;			// 当前版本开放的角色最大等级
    
    this.MAX_EQUIP_STAR_LEVEL = 10;		// 当前版本开放的装备最大星级
    this.MAX_SKILL_USED_COUNT = 6;		// 当前版本装备的技能最大数
    this.MAX_SKILL_OPEN_USED_COUNT = 5;		// 当前版本装备的技能开放数
    this.MAX_SKILL_STUDY_COUNT = 100;		// 当前版本可以学习的技能数
    
    this.MAX_RAND_NAME_TIME = 300;		// 最大随机名字有效时间
    
    // 特殊道具ID定义
    this.ITEM_BOX_1 = 101;		//金宝箱
    this.ITEM_KEY_1 = 102;		//金钥匙
    this.ITEM_BOX_2 = 103;		//银宝箱
    this.ITEM_KEY_2 = 104;		//银钥匙
    this.ITEM_BOX_3 = 105;		//铜宝箱
    this.ITEM_KEY_3 = 106;		//铜钥匙
    this.ITEM_BOX_4 = 107;		//木宝箱
    this.ITEM_KEY_4 = 108;		//木钥匙
    this.ITEM_MONEY		 = 109;		// 金币卡
    this.ITEM_GOLD		 = 110;		// 钻石卡
    // this.ITEM_BOX_1		 = 111;		// 对应打开Box表第一行数据
    // this.ITEM_BOX_2		 = 112;		// 对应打开Box表第二行数据
    // this.ITEM_BOX_3		 = 113;		// 对应打开Box表第三行数据
    this.ITEM_111		 = 114;		// 配合111使用
    this.ITEM_112		 = 115;		// 配合112使用
    this.ITEM_113		 = 116;		// 配合113使用
    
    this.ITEM_REFRESH_GOLD  	= 6;		// 代替刷新卡
    this.ITEM_BATTLE_RESTART_GOLD = 6   	// 战斗失败后重新挑战消耗钻石数
    
    // 装备位置即装备类型
    this.EQUIP_CATEGORY_WEAPON = 1;		// 武器
    this.EQUIP_CATEGORY_ARMET = 2;		// 头盔
    this.EQUIP_CATEGORY_CUIRASS = 3;		// 胸甲
    this.EQUIP_CATEGORY_GLOVE = 4;		// 手套
    this.EQUIP_CATEGORY_ORNAMENT = 5;		// 饰品
    
    // 数据表类型头ID定义
    this.DATA_TYPE_HEAD_ID_ROLE 	= 1101;	// 角色
    this.DATA_TYPE_HEAD_ID_EQUIP 	= 1102;	// 装备
    this.DATA_TYPE_HEAD_ID_SKILL	= 1103;	// 技能
    this.DATA_TYPE_HEAD_ID_ITEM 	= 1104;	// 道具
    this.DATA_TYPE_HEAD_ID_SKILL_CHIP 	= 1105;	// 技能碎片
    this.DATA_TYPE_HEAD_ID_MONSTER	= 1106;	// 怪物
    this.DATA_TYPE_HEAD_ID_TASK = 1107; // 任务

    // 颜色码
    this.COLOR_GREY_MESH = cc.c3b(111, 111, 111); //灰色遮罩
    this.COLOR_NORMAL_MESH = cc.c3b(255, 255, 255); //正常遮罩


    //按钮点击事件
    this.CLICKED_HOME_PAGE = 1;//主页
    this.CLICKED_TEAM = 2;//队伍
    this.CLICKED_FUBEN = 3;//副本
    this.CLICKED_ZHENGTAO = 4;//征讨
    this.CLICKED_SHOP = 5;//商城
    this.CLICKED_SHENJIANG = 6;//神将
    this.CLICKED_EQUIP = 7;//装备
    this.CLICKED_TREASURE = 8;//宝物
    this.CLICKED_DIVINATION = 9;//占卜
    this.CLICKED_SHENDIAN = 10;//神殿
    this.CLICKED_CHUANGDANG = 11;//闯荡
    this.CLICKED_FIRST_RECHARGE = 12;//首充
    this.CLICKED_ACTIVITY = 13;//活动
    this.CLICKED_BACKPACK = 14;//背包
    this.CLICKED_TASK= 15;//任务
    this.CLICKED_RECHARGE = 16//充值;
    this.CLICKED_EMAIL = 17;//邮件
    this.CLICKED_CHAT = 18;//聊天
    this.CLICKED_LIANHUA = 19;//炼化

}

//-----------------------------------
// 公共数据类型,用于临时存档
function PublicDataType()
{
    this.PDT_PACKAGE	= 1;
    this.PDT_SYS_MSG	= 2;
    this.PDT_USER_MAIL	= 3;
}

//-----------------------------------
// 职业类型
function ProType()
{
    this.PT_WARRIOR	= 1;
    this.PT_PALADIN	= 2;
    this.PT_MAGE	= 3;
    this.PT_PREACHER	= 4;
    this.PT_BOBBER	= 5;
    this.PT_BARD	= 6;
}

//-----------------------------------
// 职业类型
function MonsterType()
{
    this.MT_NORMAL	= 1;
    this.MT_BOSS	= 2;
    this.MT_FBOSS	= 3;
}

//-----------------------------------
// 玩家NPC类型
function PlayerMonsterType()
{
    this.PMT_PLAYER	= 1;    // player
    this.PMT_MON	= 2;	// monster
}

//贤者之墓类型
function SagetombType()
{
    this.SAGETOMB_EXP = 5;//皇陵秘境
    this.SAGETOMB_GOLD = 6;// 汉室宝藏
}
//青龙朱雀副本类型
function BlackDragonSuzakuType()
{
    this.BLACK_DRAGON = 7;//皇陵秘境
    this.SUZAKU = 8;// 汉室宝藏
}

function NoticeEventType()
{
    this.TIMER_ACTIVITY = 1000;//定时类公告 （美食大赛，公会副本）
    this.LABGYAGE_EXTRACT = 1001;//琅琊阁获得高级物品
    this.CARD_STARUP = 1002;//英雄升星到指定的星级
    this.MONTTERCHIP_SHOP = 1003;//妖麟商店获得指定的道具
    this.MONSTERCHIP_EXTRACT = 1004;//斩妖台获得指定道具（元宝袋子兵法护符）
    this.FIRST_RECHARGE = 2001;//首冲礼包
    this.MONTH_CARD = 2002;//福利月卡
    this.LEVEL_FUND = 2003;//成长基金
    this.VIP_LEVEL = 2004;//VIP等级提升
    this.PVP_RANK = 3001;//竞技场排名前三
    this.EXPEDITION_PASS = 3002;//无限城通关层数
    this.EXPEDITION_BOX = 3003;//无限城获得指定的英雄
    this.LEVEL_PASS_FULLSTAR = 3004;//满星通关副本
    this.CREATE_GUILD = 4001;//创建公会
    this.JOIN_IN_GUILD = 4002;//加入公会
    this.LEFT_GUILD = 4003;//离开公会
    this.UP_GUILD_POSITION = 4004;//提升 副会长或者会长
    this.PLAY_QD = 4006;////玩家普通签到
    this.PLAYER_MONEY_QD = 4007;  //玩家 金币签到
    this.PLAYER_GOLD_QD = 4008; //玩家 钻石签到
    this.DOWN_GUILD_POSITION = 4009;//玩家被降职
    this.OUT_GUILD = 4010; // 玩家被提出公会
    this.RUNE_EXTRACT = 1008;//符文抽卡
}

var notice_enentType = new NoticeEventType();
var msg_id;
var login_type;
var login_code;
var plat_type;
var const_value;
var public_data_type;
var pro_type;
var mon_type;
var player_mon_type;
var msg_code;

//function init()
//{
    login_type = new LoginType();
    login_code = new LoginCode();
    plat_type = new PlatformType();
    const_value = new ConstValue();
    public_data_type = new PublicDataType();
    pro_type = new ProType();
    mon_type = new MonsterType();
    player_mon_type = new PlayerMonsterType();
    msg_code = new MsgCode();
    sagetomb_type = new SagetombType();
    blackDragon_suzaku_type = new BlackDragonSuzakuType();
    //global.log(msg_id);
//}
//exports.init = init;

exports.billingMsgID = new msg_billing.MsgID();
exports.gameMsgID = new msg_game.MsgID();
exports.LoginType = login_type;
exports.LoginCode = login_code;
exports.PlatformType = plat_type;
exports.ConstValue = const_value;
exports.PublicDataType = public_data_type;
exports.ProType = pro_type;
exports.MonType = mon_type;
exports.PlayerMonType = player_mon_type;
exports.MsgCode = msg_code;
exports.SagetombType = sagetomb_type;
exports.BlackDragonSuzakuType = blackDragon_suzaku_type;
exports.NoticeEventType = notice_enentType;

