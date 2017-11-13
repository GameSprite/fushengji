/**
*游戏中的编写的辅助模块
*/
function initialize(){
	/*广播模块*/
	this.broadCast = 		require("../../game_lib/broadcast").broadCast;
	/*键值文件记录模块*/
	this.recordManager = 	require("../../game_lib/record").Record;
	this.recordManager.start();
    /*场景管理器*/
	this.scene_manager = 	require("../../game_lib/status_manager").StatusManager;
	/*音频管理器*/
	this.audio_manager = 	require("../../game_lib/audio_player").AudioManager;
	/*着色器管理器*/
	this.shader_manager = 	require("../../game_lib/shader").shaderMannager;
}
exports.modules = new initialize;