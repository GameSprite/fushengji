
function audio_manager(engine) {

    this.effectSet = {};

    this.engine = engine;

    //we need a native interface to get the sound enable.
    this.music_enabled = true;
    this.effect_enabled = true;

    // if not debug audio, close this
    this.debug = false;
}


//--------------------- handle music -------------------//
audio_manager.prototype.isMusicEnabled = function () {
    return this.music_enabled;
}

audio_manager.prototype.setMusicEnabled = function (flag) {

    var old = this.music_enabled;
    this.music_enabled = flag;

    if (old && !this.music_enabled) {
        this.engine.stopMusic(true);
    }
}

audio_manager.prototype.playMusic = function (path, isLoop) {

    if (this.music_enabled) {
        if (this.debug) console.log('play music:', path);

        if (arguments.length === 1) {
            this.engine.playMusic(path, true);
        }
        if (arguments.length === 2) {
            this.engine.playMusic(path, isLoop);
        }
    }
}

audio_manager.prototype.preloadMusic = function (path) {
    if (this.music_enabled)
        this.engine.preloadMusic(path)
}

audio_manager.prototype.stopMusic = function () {
    if (this.music_enabled) {
        if (this.debug) console.log('stop music');

        this.engine.stopMusic(false);
    }
}

audio_manager.prototype.unloadMusic = function () {
    if (this.music_enabled) 
        this.engine.stopMusic(true);
}

//volume must be in 0.0~1.0
audio_manager.prototype.setMusicVolume = function (volume) {
    if (this.music_enabled)
        this.engine.setMusicVolume(volume);
}

audio_manager.prototype.pauseMusic = function () {
    if (this.music_enabled) {
        if (this.debug) console.log('pause music');

        this.engine.pauseMusic();
    }
}

audio_manager.prototype.resumeMusic = function () {
    if (this.music_enabled) {
        if (this.debug) console.log('resume music');

        this.engine.resumeMusic();
    }
}

audio_manager.prototype.isMusicPlaying = function () {
    if (this.music_enabled) {
        return this.engine.isMusicPlaying();
    }
}

//--------------------- handle effect -------------------//
audio_manager.prototype.isEffectEnabled = function () {
    return this.effect_enabled;
}

audio_manager.prototype.setEffectEnabled = function (flag) {
    var old = this.effect_enabled;
    this.effect_enabled = flag;

    if (old && !this.effect_enabled) {

        this.engine.stopAllEffects();

        for (var path in this.effectSet) {
            this.engine.unloadEffect(path);
        }

        this.effectSet = {};
    }
}

audio_manager.prototype.playEffect = function (path, isLoop) {
    if (this.effect_enabled) {
        if (this.debug) console.log('play effect:', path);

        //set flag to 1,mean it is loaded
        this.effectSet[path] = 1;

        if (arguments.length === 1) {
            return this.engine.playEffect(path, false);
        }
        if (arguments.length === 2) {
            return this.engine.playEffect(path, isLoop);
        }
    }

}

audio_manager.prototype.preloadEffect = function (path) {

    if (this.effect_enabled) {

        if (!this.effectSet[path]) {
            if (this.debug) console.log('preload effect:', path);

            this.engine.preloadEffect(path);

            //set flag to 1,mean it is loaded
            this.effectSet[path] = 1;
        }
    }
}

audio_manager.prototype.unloadEffect = function (path) {

    if (this.effect_enabled) {

        if (this.effectSet[path]) {
            if (this.debug) console.log('unload effect:', path);

            this.engine.unloadEffect(path);

            delete this.effectSet[path];
        }
    }
}

audio_manager.prototype.unloadAllEffect = function () {

    if (this.effect_enabled) {

        this.engine.stopAllEffects();

        for (var path in this.effectSet) {
            this.engine.unloadEffect(path);
        }

        this.effectSet = {};
    }
}

audio_manager.prototype.stopEffect = function(soundId) {

    if (this.effect_enabled && soundId != undefined && soundId != null) {
        if (this.debug) console.log('stop effect:', soundId);

        this.engine.stopEffect(soundId);
    }
}

audio_manager.prototype.stopAllEffects = function() {

    if (this.effect_enabled) {
        if (this.debug) console.log('stop all effects');

        this.engine.stopAllEffects();
    }
}

//volume must be in 0.0~1.0
audio_manager.prototype.setEffectsVolume = function (volume) {
    if (this.effect_enabled)
        this.engine.setEffectsVolume(volume);
}

audio_manager.prototype.pauseAllEffects = function () {

    if (this.effect_enabled) {
        if (this.debug) console.log('pause all effects');

        this.engine.pauseAllEffects();
    }
}

audio_manager.prototype.resumeAllEffects = function () {

    if (this.effect_enabled) {
        if (this.debug) console.log('resume all effects');

        this.engine.resumeAllEffects();
    }
}

audio_manager.prototype.pauseEffect = function (id) {

    if (this.effect_enabled) {
        if (this.debug) console.log('pause effect:', id);

        this.engine.pauseEffect(id);
    }
}

audio_manager.prototype.resumeEffect = function (id) {

    if (this.effect_enabled) {
        if (this.debug) console.log('resume effect:', id);

        this.engine.resumeEffect(id);
    }
}

exports.AudioManager = new audio_manager(cc.AudioEngine.getInstance());