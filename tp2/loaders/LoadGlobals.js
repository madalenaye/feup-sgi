/**
 * @file LoadGlobals.js
 * @desc Utility module for loading and configuring global scene settings in a THREE.js environment.  
 * This includes background color, ambient light, fog settings, and a skybox.
 */

import * as THREE from 'three';

export const loadGlobals = {

    /**
     * Configures and initializes global settings for a THREE.js scene.  
     * This method loads and sets up background color, ambient lighting, fog properties, and a skybox from the provided data.
     * @method
     * @param {Object} data - An object containing global scene configuration 
     * @returns {Object} - An object containing the following scene elements:
     * - `background` {THREE.Color} - Background color for the scene.
     * - `ambient` {THREE.AmbientLight} - Ambient light for the scene.
     * - `fog` {THREE.Fog} - Fog configuration for the scene.
     * - `skybox` {THREE.Mesh} - A skybox mesh composed of six textures.
     */ 
    loadGlobals(data){
        let lightData = data.getOptions()
        let background = new THREE.Color(lightData.background[0], lightData.background[1], lightData.background[2]);
        let ambient = new THREE.AmbientLight(new THREE.Color(lightData.ambient[0], lightData.ambient[1], lightData.ambient[2]), lightData.ambient[3]);
        
        let fogOptions = data.getFog();
        let fog = new THREE.Fog(new THREE.Color(fogOptions.color[0], fogOptions.color[1], fogOptions.color[2]), fogOptions.near, fogOptions.far)
        
        let skybox = data.getSkyBox();
        const textureLoader = new THREE.TextureLoader();

        const texturePaths = [skybox.right, skybox.left, skybox.up, skybox.down, skybox.front, skybox.back];
        const materials = [];

        texturePaths.forEach((path) => {
            materials.push(
                new THREE.MeshStandardMaterial({ 
                    map: textureLoader.load(path), 
                    side: THREE.BackSide,
                    emissive: new THREE.Color(skybox.emissive[0], skybox.emissive[1], skybox.emissive[2]),
                    emissiveIntensity: skybox.intensity
                })
            );
        });

        const skyboxGeometry = new THREE.BoxGeometry(skybox.size[0], skybox.size[1], skybox.size[2]);
        const skyboxMesh = new THREE.Mesh(skyboxGeometry, materials);

        skyboxMesh.position.set(skybox.center[0], skybox.center[1], skybox.center[2]);

        return {background: background, ambient: ambient, fog: fog, skybox: skyboxMesh};
    }
   
}
