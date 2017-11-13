#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

// line color
uniform vec4 line_color = vec4(0, 0, 0, 0);
uniform float line_size = 0.002;

void main()
{
	float radius = line_size;
	float threshold = 1.75;
	vec4 accum = line_color;
	vec4 normal = vec4(0.0);
    
	normal = texture2D(u_texture, v_texCoord);
	accum.a += texture2D(u_texture, vec2(v_texCoord.x - radius, v_texCoord.y - radius));
	accum.a += texture2D(u_texture, vec2(v_texCoord.x + radius, v_texCoord.y - radius));
	accum.a += texture2D(u_texture, vec2(v_texCoord.x + radius, v_texCoord.y + radius));
	accum.a += texture2D(u_texture, vec2(v_texCoord.x - radius, v_texCoord.y + radius));
	
	accum.a *= threshold;
	
	// clip alpha
	if(accum.a < 0.05) {
		accum = vec4(0, 0, 0, 0);
	}
	
	normal = (accum * (1.0 - normal.a)) + (normal * normal.a);
	
    gl_FragColor = v_fragmentColor * normal;
}
