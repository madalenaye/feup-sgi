uniform sampler2D texture1;   
uniform sampler2D bumpmap;   

varying vec2 vUv;             
varying vec3 vNormal;         
varying vec3 vPosition;      

void main() {

    vec4 color = texture2D(texture1, vUv);

    float bump = texture2D(bumpmap, vUv).r;

    vec3 modifiedNormal = normalize(vNormal + bump * 0.2);

    gl_FragColor = color;  
}
