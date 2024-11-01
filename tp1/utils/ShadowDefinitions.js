/**
 * @file ShadowDefinitions.js
 * @desc Contains methods that allow for shadow setup.
 */

import * as THREE from 'three';

export const shadowDefinitions = {

    /**
     * Method responsible for configuring the shadow properties of a given mesh.
     * @method
     * @param {THREE.Mesh} mesh - The 3D object mesh to apply shadow settings to.
     * @param {boolean} receive - Determines if the mesh receives shadows (default is true).
     * @param {boolean} cast - Determines if the mesh casts shadows (default is true). 
     */
    objectShadow (mesh, receive = true, cast = true) {
        mesh.receiveShadow = receive;
        mesh.castShadow = cast;
    },

    /**
     * Method for setting up shadow properties for a light source.
     * @method
     * @param {THREE.Light} light - The light source to configure shadow properties for.
     * @param {number} width - The width of the shadow map resolution.
     * @param {number} height - The height of the shadow map resolution.
     * @param {number} near - The near clipping plane for the shadow camera.
     * @param {number} far - The far clipping plane for the shadow camera.
     * @param {number} left - The left boundary for the shadow camera's orthographic view.
     * @param {number} right - The right boundary for the shadow camera's orthographic view.
     * @param {number} bottom - The bottom boundary for the shadow camera's orthographic view.
     * @param {number} top - The top boundary for the shadow camera's orthographic view. 
     */
    propertiesLightShadow(light, width = 1024, height = 1024, near = 0.5, far = 20, left = -7.5, right = 7.5, bottom = -6, top = 6){
        light.castShadow = true;
        light.shadow.mapSize.width = width;
        light.shadow.mapSize.height = height;
        light.shadow.camera.near = near;
        light.shadow.camera.far = far;
        light.shadow.camera.left = left;
        light.shadow.camera.right = right;
        light.shadow.camera.bottom = bottom;
        light.shadow.camera.top = top;
    }
}