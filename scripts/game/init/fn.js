/**
*全局的方法
*/
function initialize(){
	/**
	*js对象对应的native对象是否可用
	*/
	this.isValidNative = function(nativeObjRef){
		return __isValidNativeObject(nativeObjRef);
	}

	this.importFuncModule("../../game_lib/game_utils");
	this.importFuncModule("../../game_lib/ui");
	this.importFuncModule("../../game_lib/md5");
}
/**
*导入函数模块
*@param moduleName 
*/
initialize.prototype.importFuncModule = function(moduleName){
	var funcObj = require(moduleName);
	for(var key in funcObj){
		this[key] = funcObj[key];
	}
}
exports.funcs = new initialize;