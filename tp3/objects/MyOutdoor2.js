/**
 * @file MyOutdoor2.js
 * @class MyOutdoor2
 * @extends THREE.Object3D
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents an outdoor display panel with shader-based rendering for RGB and depth textures.
 */

class MyOutdoor2 extends THREE.Object3D {
    
    /**
     * Constructs a new MyOutdoor2 instance.
     * @constructor
     * @param {Object} parameters - Configuration parameters for the display.
     * @param {number} parameters.width - The width of the display panel.
     * @param {number} parameters.height - The height of the display panel.
     * @param {THREE.Material} material - The material for the supports.
     * @param {boolean} castShadow - Determines if the panel casts shadows.
     * @param {boolean} receiveShadow - Determines if the panel receives shadows.
     */
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        this.groupOutdoor2 = new THREE.Group();

        let panelGeometry = new THREE.PlaneGeometry(parameters.width, parameters.height);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                textureRGB: { value: new THREE.Texture() },
                textureDepth: { value: new THREE.Texture() },
                depthScale: { value: 0.05 }
            },
            vertexShader: `
                uniform sampler2D textureDepth;
                uniform float depthScale;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vec4 depth = texture2D(textureDepth, uv);
                    vec3 displaced = position + normal * depth.r * depthScale;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D textureRGB;
                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(textureRGB, vUv);
                }
            `,
        });

        let panelMesh = new THREE.Mesh(panelGeometry, this.material);
        panelMesh.castShadow = castShadow ?? false;
        panelMesh.receiveShadow = receiveShadow ?? false;
        this.groupDisplay = new THREE.Group();
        this.groupDisplay.add(panelMesh);
        this.groupOutdoor2.add(this.groupDisplay);

        const supportWidth = 0.2;
        const supportHeight = parameters.height / 2;
        const supportDepth = 0.4;

        const supportMaterial = material;
        const createSupport = (x) => {
            const supportGeometry = new THREE.BoxGeometry(supportWidth, supportHeight, supportDepth);
            const supportMesh = new THREE.Mesh(supportGeometry, supportMaterial);
            supportMesh.position.set(x, -1.5 * supportHeight, 0);
            supportMesh.castShadow = castShadow ?? false;
            supportMesh.receiveShadow = receiveShadow ?? false;
            this.groupOutdoor2.add(supportMesh);
        };

        createSupport(-parameters.width / 2 + supportWidth / 2);
        createSupport(parameters.width / 2 - supportWidth / 2);
        createSupport(-parameters.width / 4);
        createSupport(parameters.width / 4);

        this.groupOutdoor2.castShadow = castShadow ?? false;
        this.groupOutdoor2.receiveShadow = receiveShadow ?? false;

        this.add(this.groupOutdoor2);
    }

    /**
     * @method
     * Updates the RGB and depth textures of the display panel.
     * @param {Object} app - The application containing the renderer and scene.
     * @param {THREE.Camera} activeCamera - The active camera for rendering.
     */
    updateTextures(app, activeCamera) {
        let renderer = app.renderer;
        let scene = app.scene;
    
        const rgbTarget = new THREE.WebGLRenderTarget(
            renderer.domElement.width,
            renderer.domElement.height
        );
    
        renderer.setRenderTarget(rgbTarget);
        renderer.render(scene, activeCamera);
        const rgbTexture = rgbTarget.texture;
    
        const depthTarget = new THREE.WebGLRenderTarget(
            renderer.domElement.width,
            renderer.domElement.height
        );
        depthTarget.depthTexture = new THREE.DepthTexture();
        depthTarget.depthTexture.format = THREE.DepthFormat;
        depthTarget.depthTexture.type = THREE.UnsignedShortType;
    
        renderer.setRenderTarget(depthTarget);
        renderer.render(scene, activeCamera);
        const depthTexture = depthTarget.depthTexture;
    
        renderer.setRenderTarget(null);
    
        this.material.uniforms.textureRGB.value = rgbTexture;
        this.material.uniforms.textureRGB.value.needsUpdate = true;
    
        this.material.uniforms.textureDepth.value = depthTexture;
        this.material.uniforms.textureDepth.value.needsUpdate = true;
    }

    /**
     * @method
     * Starts periodically updating the textures of the display panel.
     * @param {Object} app - The application containing the renderer and scene.
     * @param {THREE.Camera} activeCamera - The active camera for rendering.
     * @param {number} interval - The interval (in milliseconds) between updates.
     */
    startUpdatingTextures(app, activeCamera, interval = 60000) {
        this.updateTextures(app, activeCamera); 
        setInterval(() => this.updateTextures(app, activeCamera), interval); 
    }

}
export { MyOutdoor2 };