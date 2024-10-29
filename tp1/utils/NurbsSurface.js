/**
 * @file NurbsSurface.js
 * @desc Contains methods to create and manage NURBS surfaces
 */

import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

export const nurbsSurface = {

    /**
     * Method to create a NURBS surface mesh positioned in 3D space.
     * @method
     * @param {number} positionX - The position of the surface along the x-axis.
     * @param {number} positionY - The position of the surface along the y-axis.
     * @param {number} positionZ - The position of the surface along the z-axis.
     * @param {Array<Array<THREE.Vector3>>} controlPoints - 2D array of control points that define the surface.
     * @param {number} orderU - The order of the surface in the U direction.
     * @param {number} orderV - The order of the surface in the V direction.
     * @param {number} samplesU - The number of samples across the U direction for surface detail.
     * @param {number} samplesV - The number of samples across the V direction for surface detail.
     * @param {THREE.Material} material - Material to apply to the surface.
     * @returns {THREE.Mesh} - A mesh object representing the surface, positioned according to specified coordinates.
     */
    createNurbsSurfaces (positionX, positionY, positionZ, controlPoints, orderU, orderV, samplesU, samplesV, material) {
        this.builder = new MyNurbsBuilder();
    
        let surfaceData;
        let mesh;

        surfaceData = this.builder.build(controlPoints, orderU, orderV, samplesU, samplesV, material);
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.position.set(positionX, positionY, positionZ);

        return mesh;
    }
}