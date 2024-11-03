/**
 * @file Newspaper.js
 * @class Newspaper
 * @extends THREE.Object3D
 * @desc This class aims to represent a newspaper. 
 */

import * as THREE from 'three';
import { nurbsSurface } from '../utils/NurbsSurface.js';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a newspaper that consists of 4 pages. These pages are represented by surfaces.
 */

class Newspaper extends THREE.Object3D{

    /**
     * Constructs an object representing a newspaper.
     * @constructor
     * @param {number} positionX - The position of the newspaper on the x-axis. 
     * @param {number} positionY - The position of the newspaper on the y-axis.
     * @param {number} positionZ - The position of the newspaper on the z-axis.
     */
    constructor(positionX, positionY, positionZ){
        super();

        const map = new THREE.TextureLoader().load('./Textures/newspaper.jpg')
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        let material = new THREE.MeshPhysicalMaterial({map: map, side: THREE.DoubleSide, transparent: false, roughness: 0.9, metalness: 0.0, reflectivity: 0.1, clearcoat: 0});

        const map2 = new THREE.TextureLoader().load('./Textures/newspaper3.jpg')
        map2.wrapS = map2.wrapT = THREE.RepeatWrapping;
        map2.anisotropy = 16;
        map2.colorSpace = THREE.SRGBColorSpace;
        let material2 = new THREE.MeshPhysicalMaterial( { map: map2, side: THREE.DoubleSide, transparent: false, roughness: 0.9, metalness: 0.0, reflectivity: 0.1, clearcoat: 0 } );

        let orderU = 2;
        let orderV = 1;
        
        let controlPoints =

        [ // U = 0

            [ // V = ​​0..1;

                [ -1.5, -1.5, 0.0, 1 ],

                [ -1.5,  1.5, 0.0, 1 ]

            ],

        // U = 1

            [ // V = ​​0..1

                [ 0, -1.5, 1.0, 1 ],

                [ 0,  1.5, 1.0, 1 ]

            ],

        // U = 2

            [ // V = ​​0..1

                [ 1.5, -1.5, 0.0, 1 ],

                [ 1.5,  1.5, 0.0, 1 ]

            ]

        ]

        let controlPoints3 =

        [ // U = 0

            [ // V = ​​0..1;

                [ -1.3, -1.5, 0.0, 1 ],

                [ -1.3,  1.5, 0.0, 1 ]

            ],

        // U = 1

            [ // V = ​​0..1

                [ 0, -1.5, 0.8, 1 ],

                [ 0,  1.5, 0.8, 1 ]

            ],

        // U = 2

            [ // V = ​​0..1

                [ 1.5, -1.5, 0.0, 1 ],

                [ 1.5,  1.5, 0.0, 1 ]

            ]

        ]

        let controlPoints2 =

        [ // U = 0

            [ // V = ​​0..1;

                [ 1.5, -1.5, 0.0, 1 ],

                [ 1.5,  1.5, 0.0, 1 ]

            ],

        // U = 1

            [ // V = ​​0..1

                [ 3, -1.5, 1.0, 1 ],

                [ 3,  1.5, 1.0, 1 ]

            ],

        // U = 2

            [ // V = ​​0..1

                [ 4.5, -1.5, 0.0, 1 ],

                [ 4.5,  1.5, 0.0, 1 ]

            ]

        ]

        let controlPoints4 =

        [ // U = 0

            [ // V = ​​0..1;

                [ 1.5, -1.5, 0.0, 1 ],

                [ 1.5,  1.5, 0.0, 1 ]

            ],

        // U = 1

            [ // V = ​​0..1

                [ 3, -1.5, 0.8, 1 ],

                [ 3,  1.5, 0.8, 1 ]

            ],

        // U = 2

            [ // V = ​​0..1

                [ 4.3, -1.5, 0.0, 1 ],

                [ 4.3,  1.5, 0.0, 1 ]

            ]

        ]

        

        let page1 = nurbsSurface.createNurbsSurfaces(positionX,positionY,positionZ, controlPoints, orderU, orderV, 24, 24, material2);
        shadowDefinitions.objectShadow(page1, false, true);
        page1.rotation.x = -(Math.PI/2);
        page1.rotation.z = (Math.PI/2.5);
        page1.scale.set( 0.25,0.25,0.25 );

        let page2 = nurbsSurface.createNurbsSurfaces(positionX,positionY,positionZ, controlPoints2, orderU, orderV, 24, 24, material);
        shadowDefinitions.objectShadow(page2, false, true);
        page2.rotation.x = -(Math.PI/2);
        page2.rotation.z = (Math.PI/2.5);
        page2.scale.set( 0.25,0.25,0.25 );

        let page3 = nurbsSurface.createNurbsSurfaces(positionX,positionY,positionZ, controlPoints3, orderU, orderV, 24, 24, material2);
        shadowDefinitions.objectShadow(page3, false, true);
        page3.rotation.x = -(Math.PI/2);
        page3.rotation.z = (Math.PI/2.5);
        page3.scale.set( 0.25,0.25,0.25 );

        let page4 = nurbsSurface.createNurbsSurfaces(positionX,positionY,positionZ, controlPoints4, orderU, orderV, 24, 24, material);
        shadowDefinitions.objectShadow(page4, false, true);
        page4.rotation.x = -(Math.PI/2);
        page4.rotation.z = (Math.PI/2.5);
        page4.scale.set( 0.25,0.25,0.25 );

        this.add(page1);
        this.add(page2);
        this.add(page3);
        this.add(page4);
    }

}

export { Newspaper };