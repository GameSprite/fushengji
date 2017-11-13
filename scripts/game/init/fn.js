/**
*全局的方法
*/
function initialize(){
	/**
	*js对象对应的native对象是否可用
	*/
	this.nativeIsValid = function(nativeObjRef){
		return __isValidNativeObject(nativeObjRef);
	}

	this.importModule("../../game_lib/game_utils");
	this.importModule("../../game_lib/ui");
	this.importModule("../../game_lib/md5");
}
/**
*导入模块 
*@param moduleName 
*/
initialize.prototype.importModule = function(moduleName){
	var funcObj = require(moduleName);
	for(var key in funcObj){
		this[key] = funcObj[key];
	}
}
exports.funcs = new initialize;