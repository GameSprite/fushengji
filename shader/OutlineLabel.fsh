#ifdef GL_ES
precision highp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

uniform vec2 step;	// = vec2(0.003, 0.002);

void main()
{	
    vec4 color = texture2D(u_texture, v_texCoord) * v_fragmentColor;
	
	// weight
	float weight = 30.0;
	float assess = pow(color.a, 3) * weight;
	
	// gauss blur alpha
	float alpha = assess;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(-3.0 * step.x, -3.0 * step.y)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(-2.0 * step.x, -2.0 * step.y)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(-1.0 * step.x, -1.0 * step.y)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(0.0, 0.0)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(1.0 * step.x, 1.0 * step.y)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(2.0 * step.x, 2.0 * step.y)).a;
	alpha += texture2D(u_texture, v_texCoord.st + vec2(3.0 * step.x, 3.0 * step.y)).a;
	alpha /= 7.0 + assess;
	
	// alpha bigger, color change less
	vec3 color1 = color.rgb;
	color1 = clamp(color1 + (alpha - 1.0), 0, 1.0);
	color1 = pow(color1, vec3(3.0, 3.0, 3.0));
		
    gl_FragColor = vec4(color1.r, color1.g, color1.b, alpha);
}
