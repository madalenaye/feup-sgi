/**
 * @file CoffeeTable.js
 * @class CoffeeTable
 * @extends THREE.Object3D
 * @desc This class aims to represent a coffe table. 
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a coffee table composed of three main elements: the tabletop, the table support, and a base. 
 */

class CoffeeTable extends THREE.Object3D{

    /**
     * Constructs an object that represents a coffee table.
     * @constructor
     * @param {number} tableWidth - The width of the tabletop.
     * @param {number} tableHeight - The height of the table
     * @param {number} tableDepth - The depth of the tabletop
     * @param {THREE.Material} topMaterial - The material to be applied to the tabletop.
     * @param {number} legRadius - The radius of the cylindrical legs of the table.
     * @param {number} legHeight - The height of the legs supporting the tabletop.
     * @param {number} baseRadius - The radius of the circular base
     * @param {Object} position - Represents the position of the candle relative to the two axes.
     */
    constructor(tableWidth, tableHeight, tableDepth, topMaterial, legRadius, legHeight, baseRadius, position = { x: 0, z: 0 }) {

        super();

        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.positionX = position.x;
        this.positionZ = position.z;
        this.height = legHeight;
        
        const tableTopGeometry = new THREE.BoxGeometry(tableWidth, tableHeight, tableDepth);
        const tableTop = new THREE.Mesh(tableTopGeometry, topMaterial);

        const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32);
        const tableLeg = new THREE.Mesh(legGeometry, topMaterial);

        const baseMaterial = new THREE.MeshPhongMaterial({color: 0xcbbda9, specular:"#dddddd", shininess: 2});
        const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius + 0.4, 0.05, 32);
        const base = new THREE.Mesh(baseGeometry, baseMaterial);

        base.position.y = -legHeight; 

        tableLeg.position.y = -tableHeight / 2 - legHeight / 2;

        const table = new THREE.Group();
        table.add(tableTop);
        table.add(tableLeg);
        table.add(base);
        table.position.set(position.x, legHeight+tableHeight, position.z);
        this.add(table)
    }

}

export { CoffeeTable };