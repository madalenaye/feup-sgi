uniform sampler2D baseTexture;

varying vec2 vUv;

void main() {
    vec4 texColor = texture2D(baseTexture, vUv);

    gl_FragColor = texColor;
}