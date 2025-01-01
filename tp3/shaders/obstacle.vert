uniform float time;
uniform float amplitude; 

varying vec2 vUv;

void main() {
    vUv = uv;

    float scale = 1.0 + amplitude * sin(time);


    vec3 scaledPosition = position * scale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
}