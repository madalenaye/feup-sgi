import * as THREE from 'three'

class MyFirework {

    constructor(app, position) {
        this.app = app
        this.position = position

        this.done     = false 
        this.dest     = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 3
        this.speed = 60

        this.launch() 

    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 0.5, 0.8 )
        let colors = [ color.r, color.g, color.b ]

        let x = THREE.MathUtils.randFloat( this.position.x - 0.5, this.position.x + 0.5 ) 
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( this.position.z - 0.5, this.position.z + 0.5 ) 
        this.dest.push(x, y, z) 
        let vertices = [this.position.x, this.position.y, this.position.z]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add( this.points )  
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        this.app.scene.remove( this.points)
        const originVector = new THREE.Vector3(...origin);
        
        this.dest = [];
        this.colors = [];
        let vertices = [];

        this.geometry = new THREE.BufferGeometry();
        for (let i = 0; i < n; i++){
            const color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 0.6, 0.7);
            this.colors.push(...color.toArray());

            // random from and to positions 
            let from = new THREE.Vector3(
                THREE.MathUtils.randFloat(originVector.x - rangeBegin, originVector.x + rangeBegin),
                THREE.MathUtils.randFloat(originVector.y - rangeBegin, originVector.y + rangeBegin),
                THREE.MathUtils.randFloat(originVector.z - rangeBegin, originVector.z + rangeBegin)
            );
            let to = new THREE.Vector3(
                THREE.MathUtils.randFloat(originVector.x - rangeEnd, originVector.x + rangeEnd),
                THREE.MathUtils.randFloat(originVector.y - rangeEnd, originVector.y + rangeEnd),
                THREE.MathUtils.randFloat(originVector.z - rangeEnd, originVector.z + rangeEnd)
            );

            vertices.push(from);
            this.dest.push(to.x, to.y, to.z);

        }
        this.geometry.setFromPoints(vertices);
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;

        this.app.scene.add(this.points);

    }
    
    /**
     * cleanup
     */
    reset() {
        console.log("firework reseted")
        this.app.scene.remove( this.points )  
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8) 
                    return 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}

export { MyFirework }