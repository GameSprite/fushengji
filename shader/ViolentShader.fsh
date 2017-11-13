#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main()
{
    vec4 color = texture2D(u_texture, v_texCoord) * v_fragmentColor;
	color += vec4(0.6, 0.0, 0.0, 0.0) * color.a;
    gl_FragColor = color;
}
