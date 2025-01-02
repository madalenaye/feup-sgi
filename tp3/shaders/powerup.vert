uniform sampler2D texture1;    
uniform sampler2D bumpmap;   
uniform float time;           

varying vec2 vUv;             
varying vec3 vNormal;         
varying vec3 vPosition;        

void main() {
    vUv = uv;                  
    vNormal = normal;          
    vPosition = position;      

    float angle = time * 0.7;  
    mat4 rotationMatrix = mat4(
        cos(angle), -sin(angle), 0.0, 0.0,
        sin(angle), cos(angle), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    vec3 rotatedPosition = (rotationMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
}
