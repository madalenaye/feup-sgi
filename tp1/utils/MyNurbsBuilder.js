/**
 * @file MyNurbsBuilder.js
 * @class MyNurbsBuilder
 * @extends THREE.Object3D
 * @desc This class contains the contents of out application 
 */


import * as THREE from 'three';

import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';

import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * @class
 * @classdesc This class contains the contents of out application.
 */

class MyNurbsBuilder  {


    /**

       Constructs the object
       @constructor
       @param {MyApp} app - The application object

    */

    constructor(app) {

        this.app = app

    }

    /**
     * Method to build a NURBS surface based on given control points, degrees, and sample counts for each axis. 
     * @method
     * @param {Array<Array<THREE.Vector3>>} controlPoints - A 2D array of control points defining the surface grid
     * @param {number} degree1 - The degree of the NURBS surface in the first direction (U).
     * @param {number} degree2 - The degree of the NURBS surface in the second direction (V).
     * @param {number} samples1 - The number of samples along the U direction for generating the geometry.
     * @param {number} samples2 - The number of samples along the V direction for generating the geometry.
     * @param {THREE.Material} material - The material applied to the NURBS surface geometry.
     * @returns {THREE.Geometry} The generated NURBS surface geometry
     */
    build(controlPoints, degree1, degree2, samples1, samples2, material) {


        const knots1 = []

        const knots2 = []


        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];

        for (var i = 0; i <= degree1; i++) {

            knots1.push(0)

        }

        for (var i = 0; i <= degree1; i++) {

            knots1.push(1)

        }


        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];

        for (var i = 0; i <= degree2; i++) {

            knots2.push(0)

        }

        for (var i = 0; i <= degree2; i++) {

            knots2.push(1)

        }


        let stackedPoints = []

        for (var i = 0; i < controlPoints.length; i++) {

            let row = controlPoints[i]

            let newRow = []

            for (var j = 0; j < row.length; j++) {

                let item = row[j]

                newRow.push(new THREE.Vector4(item[0],

                item[1], item[2], item[3]));

            }

            stackedPoints[i] = newRow;

        }


        const nurbsSurface = new NURBSSurface( degree1, degree2,

                                     knots1, knots2, stackedPoints );

        const geometry = new ParametricGeometry( getSurfacePoint,

                                                 samples1, samples2 );

        return geometry;


       

        function getSurfacePoint( u, v, target ) {

            return nurbsSurface.getPoint( u, v, target );

        }

    }
    

}


export { MyNurbsBuilder };