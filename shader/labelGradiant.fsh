#ifdef GL_ES
precision highp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

uniform float start_y;
uniform float start_x;
uniform int type;
uniform float label_width;
uniform float label_height;
uniform vec4 startColor;
uniform vec4 endColor;

void main()
{
    float startPercent = 0.0;
    float endPercent = 0.0;
    if(type == 1)
    {
       startPercent = 1.0 - (gl_FragCoord.y - 0.5 - start_y)/label_height;
       endPercent = 1.0 - startPercent;
    }else
    {
       startPercent = 1.0 - (gl_FragCoord.x - 0.5 - start_x)/label_width;
       endPercent = 1.0 - startPercent;
    }

    vec4 blendColor = startColor * startPercent + endColor * endPercent;

    blendColor =  texture2D(u_texture,v_texCoord) * blendColor;
    gl_FragColor = blendColor;

}
