/**
 * @file LoadCameras.js
 * @desc Utility module for loading and creating cameras in a 3D scene.
 * Provides functionality to create and configure multiple camera types
 */

import * as THREE from 'three';

export const loadCameras = {

    /**
     * Creates and configures a list of cameras based on the provided data.
     * @method
     * @param {Object} data - JSON object containing camera configurations.
     * @returns {Array<THREE.Camera>} - Array of configured THREE.js cameras.
     */    
    createCameras(data){

        let cameras = [];

        Object.keys(data).forEach(key => {
            let camera = null;

            if(data[key].type == "perspective"){
                camera = new THREE.PerspectiveCamera(
                    data[key].angle, 
                    window.innerWidth / window.innerHeight, 
                    data[key].near, 
                    data[key].far
                );
            }
            else if(data[key].type == "orthogonal"){
                camera = new THREE.OrthographicCamera(
                    data[key].left,
                    data[key].right, 
                    data[key].top, 
                    data[key].bottom, 
                    data[key].near, 
                    data[key].far
                );
            }

            camera.name = data[key].id;
            camera.lookAt(new THREE.Vector3(data[key].target[0], data[key].target[1], data[key].target[2]))
            camera.position.set(data[key].location[0], data[key].location[1], data[key].location[2]);
            cameras.push(camera);
        });

        return cameras
    }
   
}
