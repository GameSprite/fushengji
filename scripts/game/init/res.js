/**
*游戏中的资源
*/
function initialize(){
	
}
initialize.prototype.ccbi = function(){
	
}
initialize.prototype.pic = function(picName){
	return "./pic/"+picName+".png";
}
initialize.prototype.jpg = function(picName){
	return "./pic/"+picName+".jpg";
}
exports.resources = new initialize;