/**
 * Created by cgz on 2017/10/17.
 *单例广播
 */
var broadCast = {
    instance:null,
    getInstance:function(){
        if(!this.instance){
            this.instance = new this.initialize();
        }
        return this.instance;
    },
    /**
     * 构造器
     * @private
     */
    initialize:function(){
        this.events = {};
        /**
         * 注册事件
         * @param eventName
         * @param callBack
         */
        this.regist = function(eventName,callBack){
            if(!(typeof callBack == 'function' && typeof eventName == 'string')){
                console.log("error: 事件注册失败，请检查传入参数类型");
                return;
            }
            if(!this.events[eventName])
                this.events[eventName] = [];
            //检查是1个事件是否注册了2次同一个回调函数
            if(this.events[eventName].indexOf(callBack) != -1){
                console.log('注意:1个回调方法注册了2次,注册行为将废弃');
                return;
            }

            this.events[eventName].push(callBack);
        }
        /**
         * 发射事件，之后回调方法将被调用，同时传入所有不定长参数
         * @param eventName
         */
        this.emit = function(eventName){
            var callBackList = this.events[eventName];
            if(!callBackList)
                return;
            var args = Array.prototype.slice.call(arguments);
            for(var i=0;i<callBackList.length;i++){
                if(!callBackList[i]){
                    callBackList.splice(i,1);
                    i--;
                }else{
                    callBackList[i].apply({},args.slice(1));
                }
            }
        }
        /**
         * 移除广播监听
         * @param eventName
         */
        this.remove = function(eventName){
            if(this.events[eventName]){
                this.events[eventName] = [];
            }
        }
    }
};

exports.broadCast = broadCast;