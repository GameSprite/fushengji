#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

uniform float alpha;

void main()
{
    vec4 color = texture2D(u_texture, v_texCoord) * v_fragmentColor;
    if (color.a > 0.1) {    	
		color = color * (1.0 - alpha) + vec4(1.0, 1.0, 1.0, 1.0) * alpha;
    }
    gl_FragColor = color;
}
