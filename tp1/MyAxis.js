/**
 * @file MyAxis.js
 * @class MyAxis
 * @desc This class provides a 3D axis representation, useful for orienting and visualizing directional axes in the scene.
 */

import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * @class
 * @classdesc This class contains a 3D axis representation
 */

class MyAxis extends THREE.Object3D {

    /**
     * Constructs a 3D axis object with customizable parameters for visualizing orientation in the scene. 
     * @constructor
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {number} baseRadius the base radius of each axis
     * @param {number} xxColor the hexadecimal representation of the xx axis color
     * @param {number} yyColor the hexadecimal representation of the xx axis color
     * @param {number} zzColor the hexadecimal representation of the zz axis color
     */
    constructor(app, size, baseRadius, xxColor, yyColor, zzColor) {
        super();
        this.app = app;
        this.type = 'Group';
        this.size = size || 2;
        this.baseRadius = baseRadius || 0.05;
        this.xxColor = xxColor || 0xff0000
        this.yyColor = yyColor || 0x00ff00
        this.zzColor = zzColor || 0x0000ff

        // a cone geometry for the xx axis
        const xx = new THREE.ConeGeometry( this.baseRadius, this.size, 32 ); 
        const xxMaterial = new THREE.MeshBasicMaterial( {color: this.xxColor} );
        this.xxMesh = new THREE.Mesh(xx, xxMaterial ); 
        this.xxMesh.position.set(this.size/2,0,0);
        this.xxMesh.rotation.z = -Math.PI / 2;
        this.add( this.xxMesh );

        // a cone geometry for the yy axis
        const yy = new THREE.ConeGeometry( this.baseRadius, this.size, 32 ); 
        const yyMaterial = new THREE.MeshBasicMaterial( {color: this.yyColor} );
        this.yyMesh = new THREE.Mesh(yy, yyMaterial ); 
        this.yyMesh.position.set(0, this.size/2,0);
        this.add( this.yyMesh );

        // a cone geometry for the zz axis
        const zz = new THREE.ConeGeometry( this.baseRadius, this.size, 32 ); 
        const zzMaterial = new THREE.MeshBasicMaterial( {color: this.zzColor} );
        this.zzMesh = new THREE.Mesh(zz, zzMaterial ); 
        this.zzMesh.position.set(0,0,this.size/2);
        this.zzMesh.rotation.x = Math.PI / 2;
        this.add( this.zzMesh ); 

        // an axis helper
        this.axesHelper = new THREE.AxesHelper( 5 );
        this.axesHelper.setColors ( new THREE.Color( this.xxColor ),  new THREE.Color( this.yyColor ),  new THREE.Color( this.zzColor ))
        this.add( this.axesHelper );
    }

    /**
     * Method to update the visibility of the axes
     * @method
     * @param {boolean} visible - Boolean indicating whether the axes should be visible
     */
    setVisible(visible) {
        this.axesHelper.visible = visible;
        this.xxMesh.visible = visible;
        this.yyMesh.visible = visible;
        this.zzMesh.visible = visible;
    }
}

MyAxis.prototype.isGroup = true;

export { MyAxis };