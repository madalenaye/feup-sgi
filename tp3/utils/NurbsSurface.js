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
     * @param {Array<Array<THREE.Vector3>>} controlPoints - 2D array of control points that define the surface.
     * @param {number} orderU - The order of the surface in the U direction.
     * @param {number} orderV - The order of the surface in the V direction.
     * @param {number} samplesU - The number of samples across the U direction for surface detail.
     * @param {number} samplesV - The number of samples across the V direction for surface detail.
     * @param {THREE.Material} material - Material to apply to the surface.
     * @returns {THREE.Mesh} - A mesh object representing the surface, positioned according to specified coordinates.
     */
    createNurbsSurfaces (controlPoints, orderU, orderV, samplesU, samplesV, material) {
        this.builder = new MyNurbsBuilder();
    
        let surfaceData;
        let mesh;

        const numPointsU = orderU + 1;
        const numPointsV = orderV + 1;

        const controlGrid = [];
        let index = 0;

        for (let i = 0; i < numPointsU; i++) {
            const row = [];
            for (let j = 0; j < numPointsV; j++) {
                const point = controlPoints[index];
                row.push([point.x, point.y, point.z, 1]);
                index++;
            }
            controlGrid.push(row);
        }

        surfaceData = this.builder.build(controlGrid, orderU, orderV, samplesU, samplesV, material);
        mesh = new THREE.Mesh(surfaceData, material);
        return mesh;
    }
}