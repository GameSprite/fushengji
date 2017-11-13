/**
*全局的常量
*/
function initialize(){
	/************设备内存状态***********/
	var totalmem = os.totalmem();       //Mb
    this.isLowerMachine = totalmem < 800;
}

exports.consts = new initialize;