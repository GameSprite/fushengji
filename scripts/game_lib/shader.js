
//shader base
function shader(name) {

    this.name = name;

    this._shader = null;
}

shader.prototype.init = function () {
    //console.log(this.name + " shader init.");

    if (this._shader) {
        this._shader.addAttribute("a_position", 0);
        this._shader.addAttribute("a_color", 1);
        this._shader.addAttribute("a_texCoord", 2);

        this._shader.link();
        this._shader.updateUniforms();
    }
}

shader.prototype.reload = function () {

    console.log(this.name + " shader reload.");

    if (this._shader) {
        this._shader.addAttribute("a_position", 0);
        this._shader.addAttribute("a_color", 1);
        this._shader.addAttribute("a_texCoord", 2);

        this._shader.link();
        this._shader.updateUniforms();
    }

}

shader.prototype.getshader = function () {
    return this._shader;
}

//base vertex shader
shader.base_vsh =
"									                \n\
attribute vec4 a_position;							\n\
attribute vec2 a_texCoord;							\n\
attribute vec4 a_color;								\n\
													\n\
#ifdef GL_ES										\n\
varying lowp vec4 v_fragmentColor;					\n\
varying mediump vec2 v_texCoord;					\n\
#else												\n\
varying vec4 v_fragmentColor;						\n\
varying vec2 v_texCoord;							\n\
#endif												\n\
													\n\
void main()											\n\
{													\n\
    gl_Position = CC_MVPMatrix * a_position;		\n\
	v_fragmentColor = a_color;						\n\
	v_texCoord = a_texCoord;						\n\
}													\n\
";


//------------------ all shader begin ----------------//

//----------------------------- normal shader --------------------------//
normal.prototype.__proto__ = shader.prototype;

function normal() {

    //call parent contractor
    shader.call(this, "normal");
}

normal.prototype.init = function () {

    this._shader = cc.GLProgram.createWithString(shader.base_vsh, normal.fsh);

    //call parent init
    shader.prototype.init.call(this);
}

normal.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(shader.base_vsh, normal.fsh);

        //call parent reload
        shader.prototype.reload.call(this);
    }
}

//fragment shader
normal.fsh =
"											\n\
#ifdef GL_ES								\n\
precision lowp float;						\n\
#endif										\n\
											\n\
varying vec4 v_fragmentColor;				\n\
varying vec2 v_texCoord;					\n\
uniform sampler2D CC_Texture0;				\n\
											\n\
void main()									\n\
{											\n\
    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);			\n\
}											\n\
";

//----------------------------- brightness shader --------------------------//
brightness.prototype.__proto__ = shader.prototype;

function brightness() {

    //call parent contractor
    shader.call(this, "brightness");
}

brightness.prototype.init = function () {

    this._shader = cc.GLProgram.createWithString(shader.base_vsh, brightness.fsh);

    //call parent init
    shader.prototype.init.call(this);
}

brightness.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(shader.base_vsh, brightness.fsh);

        //call parent reload
        shader.prototype.reload.call(this);
    }
}

//fragment shader
brightness.fsh =
"											\n\
#ifdef GL_ES								\n\
precision lowp float;						\n\
#endif										\n\
											\n\
varying vec4 v_fragmentColor;				\n\
varying vec2 v_texCoord;					\n\
uniform sampler2D CC_Texture0;				\n\
											\n\
void main()									\n\
{											\n\
    vec4 color = texture2D(CC_Texture0, v_texCoord);                        \n\
    float a = v_fragmentColor.a * color.a;			                        \n\
    gl_FragColor = vec4((color.rgb + v_fragmentColor.rgb) * a, a); 	        \n\
}											                                \n\
";

//----------------------------- gray shader --------------------------//
gray.prototype.__proto__ = shader.prototype;

function gray() {

    //call parent contractor
    shader.call(this, "gray");
}

gray.prototype.init = function () {

    this._shader = cc.GLProgram.createWithString(shader.base_vsh, gray.fsh);

    //call parent init
    shader.prototype.init.call(this);
}

gray.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(shader.base_vsh, gray.fsh);

        //call parent reload
        shader.prototype.reload.call(this);
    }
}

//fragment shader
gray.fsh =
"											\n\
#ifdef GL_ES								\n\
precision lowp float;						\n\
#endif										\n\
											\n\
varying vec4 v_fragmentColor;				\n\
varying vec2 v_texCoord;					\n\
uniform sampler2D CC_Texture0;				\n\
											\n\
void main()									\n\
{											\n\
	//store the alpha						\n\
    vec4 color = texture2D(CC_Texture0, v_texCoord);    \n\
	float a = v_fragmentColor.a * color.a;		\n\
	//convert RGB to YUV, Y mean Gray		\n\
	float gray = dot(color.rgb, vec3(0.299,0.587,0.114));			\n\
    if (a < 0.1) gray *= a;                 \n\
	gl_FragColor = vec4(gray,gray,gray,a);	\n\
}											\n\
";


//----------------------------- bloom shader --------------------------//
bloom.prototype.__proto__ = shader.prototype;

function bloom() {

    //call parent contractor
    shader.call(this, "bloom");
}

//we need offset to blend the color
bloom.prototype.init = function (sx, sy) {

    this._shader = cc.GLProgram.createWithString(bloom.vsh, bloom.fsh);

    //call parent init
    shader.prototype.init.call(this);

    //store the texture step
    this.stepX = sx;
    this.stepY = sy;

    var x_index = this._shader.getUniformLocationForName("stepX");
    this._shader.setUniformLocationWith1f(x_index, this.stepX);

    var y_index = this._shader.getUniformLocationForName("stepY");
    this._shader.setUniformLocationWith1f(y_index, this.stepY);
}

bloom.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(bloom.vsh, bloom.fsh);

        //call parent reload
        shader.prototype.reload.call(this);

        var x_index = this._shader.getUniformLocationForName("stepX");
        this._shader.setUniformLocationWith1f(x_index, this.stepX);

        var y_index = this._shader.getUniformLocationForName("stepY");
        this._shader.setUniformLocationWith1f(y_index, this.stepY);
    }
}

//we can only use five texCoords , since in iphone4 more than six will cause fps drop to 30.
//vertex shader
bloom.vsh =
"									                \n\
attribute vec4 a_position;							\n\
attribute vec2 a_texCoord;							\n\
attribute vec4 a_color;								\n\
													\n\
#ifdef GL_ES										\n\
uniform mediump float stepX;                        \n\
uniform mediump float stepY;                        \n\
varying lowp vec4 v_fragmentColor;					\n\
varying mediump vec2 v_texCoord;					\n\
varying mediump vec2 v_leftCoord;					\n\
varying mediump vec2 v_rightCoord;					\n\
varying mediump vec2 v_topCoord;					\n\
varying mediump vec2 v_bottomCoord;					\n\
#else												\n\
uniform float stepX;                                \n\
uniform float stepY;                                \n\
varying vec4 v_fragmentColor;						\n\
varying vec2 v_texCoord;							\n\
varying vec2 v_leftCoord;					        \n\
varying vec2 v_rightCoord;					        \n\
varying vec2 v_topCoord;					        \n\
varying vec2 v_bottomCoord;					        \n\
#endif												\n\
													\n\
void main()											\n\
{													\n\
    gl_Position = CC_MVPMatrix * a_position;		\n\
	v_fragmentColor = a_color;						\n\
    vec2 w_step = vec2(stepX,0.0);                  \n\
    vec2 h_step = vec2(0.0,stepY);                  \n\
	v_texCoord = a_texCoord;						\n\
    v_leftCoord = a_texCoord - w_step;						\n\
    v_rightCoord = a_texCoord + w_step;						\n\
    v_topCoord = a_texCoord - h_step;						\n\
    v_bottomCoord = a_texCoord + h_step;					\n\
}													        \n\
";

//fragment shader
bloom.fsh =
"											\n\
#ifdef GL_ES								\n\
precision lowp float;						\n\
#endif										\n\
											\n\
varying vec4 v_fragmentColor;				\n\
varying vec2 v_texCoord;							\n\
varying vec2 v_leftCoord;					        \n\
varying vec2 v_rightCoord;					        \n\
varying vec2 v_topCoord;					        \n\
varying vec2 v_bottomCoord;					        \n\
uniform sampler2D CC_Texture0;				\n\
											\n\
void main()									\n\
{											\n\
    vec4 tcolor = texture2D(CC_Texture0, v_texCoord);                   \n\
    if(tcolor.a > 0.05)                                                 \n\
        gl_FragColor = tcolor;                                          \n\
    else                                                                \n\
    {                                                                   \n\
        float a = 0.0;                                                  \n\
        a += texture2D(CC_Texture0, v_texCoord).a;                      \n\
        a += texture2D(CC_Texture0, v_leftCoord).a;                     \n\
        a += texture2D(CC_Texture0, v_rightCoord).a;                    \n\
        a += texture2D(CC_Texture0, v_topCoord).a;                      \n\
        a += texture2D(CC_Texture0, v_bottomCoord).a;                   \n\
        gl_FragColor = vec4(v_fragmentColor.rgb  , 0.25 * a);           \n\
    }                                                                   \n\
}											                            \n\
";

//----------------------------- bloom dynamic shader --------------------------//
bloom_d.prototype.__proto__ = shader.prototype;

function bloom_d() {

    //call parent contractor
    shader.call(this, "bloom_d");
}

//we need offset to blend the color
bloom_d.prototype.init = function (sx, sy) {

    this._shader = cc.GLProgram.createWithString(bloom.vsh, bloom.fsh);

    //call parent init
    shader.prototype.init.call(this);

    //store the texture step
    this.stepX = sx;
    this.stepY = sy;

    var x_index = this._shader.getUniformLocationForName("stepX");
    this._shader.setUniformLocationWith1f(x_index, this.stepX);

    var y_index = this._shader.getUniformLocationForName("stepY");
    this._shader.setUniformLocationWith1f(y_index, this.stepY);

    //store the index
    this._shader.x_index = x_index;
    this._shader.y_index = y_index;

    //init update function
    this._shader.update = function (sx, sy) {
        this.use();
        this.setUniformLocationWith1f(this.x_index, sx);
        this.setUniformLocationWith1f(this.y_index, sy);
    }
}

bloom_d.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(bloom.vsh, bloom.fsh);

        //call parent reload
        shader.prototype.reload.call(this);

        var x_index = this._shader.getUniformLocationForName("stepX");
        this._shader.setUniformLocationWith1f(x_index, this.stepX);

        var y_index = this._shader.getUniformLocationForName("stepY");
        this._shader.setUniformLocationWith1f(y_index, this.stepY);

        //store the index
        this._shader.x_index = x_index;
        this._shader.y_index = y_index;
    }
}

//----------------------------- file shader --------------------------//
shader_file.prototype.__proto__ = shader.prototype;

// file string caches
shader_file.caches = {};

// get string
// type: vsh, fsh
shader_file.get = function (name, type) {
    if (!this.caches[name]) {
        this.caches[name] = {};
    }

    var cache = this.caches[name];
    if (!cache[type]) {
        var file ='./shader/' + name + '.' + type;
        if (fs.exist(file)) {
            cache[type] = fs.readfile(file).toString();
        } else {
            cache[type] = shader.base_vsh;
            //console.log('shader file [', file, '] not found, we will use default string.');
        }
    }

    return cache[type];
}

function shader_file(name) {

    //call parent contractor
    shader.call(this, name);

    this.vsh = shader_file.get(this.name, 'vsh');
    this.fsh = shader_file.get(this.name, 'fsh');
}

// args: [name;value]
shader_file.prototype.init = function () {

    if (this.vsh && this.fsh) {
        this._shader = cc.GLProgram.createWithString(this.vsh, this.fsh);
        this._shader.obj = this;
    }

    //call parent init
    shader.prototype.init.call(this);

    if (this._shader) {
        if (arguments.length > 0) {
            this.args = Array.prototype.slice.call(arguments, 0);
            this.setArgs();
        }
    }
}

shader_file.prototype.reload = function () {

    if (this._shader) {

        this._shader.reset();

        this._shader.initWithString(this.vsh, this.fsh);

        //call parent reload
        shader.prototype.reload.call(this);

        this.setArgs();
    }
}

// set args
shader_file.prototype.setArgs = function (args) {
    if (args) {
        this.args = args;
        this._shader.use();
    }

    if (!this.args) {
        return;
    }

    for (var i = 0; i < this.args.length; ++i) {
        var parts = this.args[i].split(';');
        var index = this._shader.getUniformLocationForName(parts[0]);
        var set_func = 'setUniformLocationWith';
        var value_len = parts.length - 1;
        if (value_len > 1) {
            set_func += (value_len + 'f');
        } else if (value_len == 1) {
            set_func += (parts[1].indexOf('.') == -1 ? '1i' : '1f');
        }

        if (this._shader[set_func]) {
            var args = [index];
            args = args.concat(parts.slice(1));
            this._shader[set_func].apply(this._shader, args);
        } else {
            console.log('shader func not found:', set_func);
        }
    }
}

//------------------ all shader end   ----------------//




//shader manager
var shaderMannager = {};

//cache all shader
shaderMannager.caches = {};
//store other shader for reload in android.
shaderMannager.others = [];

//store gradient label use gradient label
shaderMannager.gradientLabels = [];

shaderMannager.shader_file = shader_file;

shaderMannager.map = {
    bloom: bloom,
    bloom_d: bloom_d,
    brightness: brightness,
    gray: gray,
    normal: normal
};

shaderMannager.createShader = function (name) {
    if (this.map[name]) {
        return new this.map[name]();
    } else {
        return new shader_file(name);
    }
}

shaderMannager.getshader = function (key) {

    var args = Array.prototype.slice.call(arguments, 1);

    if (args.length > 0) {

        //shader need use some uniform, so we can not use the cache

        try {
            var obj = this.createShader(key);
        }
        catch (e) {
            console.log(key + " shader is not found !!!");

            return null;
        }

        obj.init.apply(obj, args);

        this.others.push(obj);

        return obj.getshader();
    }

    //use caches
    if (!this.caches[key]) {

        try {
            var obj = this.createShader(key);
        }
        catch (e) {
            console.log(key + " shader is not found !!!");

            return null;
        }

        obj.init.call(obj);

        //need retain the shader
        obj.getshader().retain();

        this.caches[key] = obj;
    }

    return this.caches[key].getshader();
}

//we need reload cache shader when enter foreground in android.
var platform = os.platform();

if (platform == "android") {

	//use regl callback
    __setReglCallback(function () {
        for (var key in shaderMannager.caches) {

            var obj = shaderMannager.caches[key];

            obj.reload();
        }

        //reload others if need
        var new_arr = [];

        for (var i = 0; i < shaderMannager.others.length; i++) {
            //maybe shader is release
            try {
                shaderMannager.others[i].reload();
                new_arr.push(shaderMannager.others[i]);
            }
            catch (e) {
                //just ignore the error
            }
        }
        shaderMannager.others = new_arr;

        new_arr = [];
        for(var i = 0;i < shaderMannager.gradientLabels.length;i++){
            if(shaderMannager.gradientLabels[i].isValidNative()){
                new_arr.push(shaderMannager.gradientLabels[i]);
            }
        }
        shaderMannager.gradientLabels = [];
        for(var i = 0;i < new_arr.length;i++){
           new_arr[i].updateShader();
        }

    });

}

exports.shaderMannager = shaderMannager;