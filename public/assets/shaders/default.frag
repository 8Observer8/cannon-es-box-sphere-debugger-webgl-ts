
precision mediump float;

const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const float ambient = 0.3;

uniform vec3 uLightPosition;
uniform sampler2D uSampler;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    vec4 color = texture2D(uSampler, vTexCoord);
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(uLightPosition - vPosition);
    float nDotL = max(dot(lightDirection, normal), ambient);
    vec3 diffuse = lightColor * color.rgb * nDotL;
    gl_FragColor = vec4(diffuse, color.a);
}
