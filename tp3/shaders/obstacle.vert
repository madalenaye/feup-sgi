uniform float time;
uniform float amplitude;
uniform float frequency;

varying vec3 vNormal;       
varying vec3 vPosition;      
varying vec2 vUv;            

void main() {

    float scale = 1.0 + sin(time * frequency) * amplitude;


    vec3 transformedPosition = position * scale;

    vNormal = normalMatrix * normal;      
    vPosition = (modelViewMatrix * vec4(transformedPosition, 1.0)).xyz;
    vUv = uv;                      

    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}
