/**
 * @file MyTriangle.js
 * @class MyTriangle
 * @extends THREE.BufferGeometry
 * @desc This class aims to represent a Triangle. 
 */


import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a 3D triangle with computed normals and UV mapping, extending THREE.BufferGeometry.
 */

class MyTriangle extends THREE.BufferGeometry {

	/**
	 * MyTriangle
	 * @constructor
	 * @param x1 - x coordinate vertex 1
	 * @param y1 - y coordinate vertex 1
	 * @param x2 - x coordinate vertex 2
	 * @param y2 - y coordinate vertex 2
	 * @param x3 - x coordinate vertex 3
	 * @param y3 - y coordinate vertex 3
	 * @param afs - afs texture coordinate
	 * @param aft - aft texture coordinate
	 */
	constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, afs = 1, aft = 1) {
		super();
		
        this.p1 = new THREE.Vector3(x1, y1, z1)
		this.p2 = new THREE.Vector3(x2, y2, z2)
		this.p3 = new THREE.Vector3(x3, y3, z3)
        this.initBuffers();
	}

	/**
     * Initializes the triangle geometry by computing normals, vertices, and UV coordinates,
	 * and setting the necessary attributes for the BufferGeometry.
     * @method
     */

	initBuffers() {

        //CALCULATING NORMALS 
        var vectorAx = this.p2.x - this.p1.x
		var vectorAy = this.p2.y - this.p1.y
		var vectorAz = this.p2.z - this.p1.z

		var vectorBx = this.p3.x - this.p1.x
		var vectorBy = this.p3.y - this.p1.y
		var vectorBz = this.p3.z - this.p1.z

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy
		
		var normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
        normal.normalize()

        //TEXTURE COORDINATES
		let a = this.p1.distanceTo(this.p2);
		let b = this.p2.distanceTo(this.p3);
		let c = this.p1.distanceTo(this.p3);


		let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
		let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)

		const vertices = new Float32Array( [
            ...this.p1.toArray(),	//0
			...this.p2.toArray(),	//1
			...this.p3.toArray(),	//2

        ] );
		
		const indices = [
            0, 1, 2
        ];
		
		const normals = [
			...normal.toArray(),
			...normal.toArray(),
			...normal.toArray(),
		];

/* 		const uvs = [
			0, 0,
			a , 0,
			c * cos_ac, c * sin_ac
		] */

		const uvs = [
			0, 0,
			1 , 0,
			1 * cos_ac, 1 * sin_ac
		]

        this.setIndex( indices );
        this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        this.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2));
	}

}

export { MyTriangle };