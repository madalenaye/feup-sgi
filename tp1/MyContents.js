import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {


        // create once

        if (this.axis === null) {

            // create and attach the axis to the scene

            this.axis = new MyAxis(this)

            this.app.scene.add(this.axis)

        }


        // variables to hold the curves

        this.polyline = null
        this.quadraticBezierCurve = null
        this.cubicBezierCurve = null
        this.catmullRomCurve3 = null

        // number of samples to use for the curves (not for polyline)

        this.numberOfSamples = 16


        // hull material and geometry

        this.hullMaterial =

            new THREE.MeshBasicMaterial( {color: 0xffffff,

                    opacity: 3.50, transparent: true} );

       

        // curve recomputation

        this.recompute();

    }



    // Deletes the contents of the line if it exists and recreates them

    recompute() {

        if (this.polyline !== null) this.app.scene.remove(this.polyline)

        this.initPolyline()

        if (this.quadraticBezierCurve !== null)

            this.app.scene.remove(this.quadraticBezierCurve)

        if (this.cubicBezierCurve !==null)

            this.app.scene.remove(this.cubicBezierCurve)


        //this.initQuadraticBezierCurve()

        if (this.catmullRomCurve3 !== null)

            this.app.scene.remove(this.catmullRomCurve3)
        
        this.initCatmullRomCurve3()

    }


    

    drawHull(position, points) {

       

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        let line = new THREE.Line( geometry, this.hullMaterial );

        // set initial position

        line.position.set(position.x,position.y,position.z)

        this.app.scene.add( line );

    }

    


    initPolyline() {


        // define vertex points

        let points = [

            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
    
            new THREE.Vector3( -0.6,  0.6, 0.0 ), // control point
    
            new THREE.Vector3(  0.6, -0.6, 0.0 ),  // ending point

            new THREE.Vector4(0.6, 0.6, 0.0)
    
        ]


        let position = new THREE.Vector3(-4,4,0)

        this.drawHull(position, points);


        // define geometry

        const geometry = new THREE.BufferGeometry().setFromPoints( points );


        // create the line from material and geometry

        this.polyline = new THREE.Line( geometry,

            new THREE.LineBasicMaterial( { color: 0xff0000 } ) );


        // set initial position

        this.polyline.position.set(position.x,position.y,position.z)


        // add the line to the scene

        this.app.scene.add( this.polyline );

    }

    initCatmullRomCurve3() {


        let points = [
    
            new THREE.Vector3( -0.6, 0, 0 ),

            new THREE.Vector3(  -0.3,0.6,0.3 ),

            new THREE.Vector3(  0,0,0 ),

            new THREE.Vector3( 0.3,-0.6,0.3 ),

            new THREE.Vector3 ( 0.6,0,0),

            new THREE.Vector3 ( 0.9,0.6,0.3),
            
            new THREE.Vector3 ( 1.2,0,0)
    
        ]

    
            let position = new THREE.Vector3(-2,4,0)
    
            this.drawHull(position, points);
    
    
    
    
        let curve =
    
            new THREE.CatmullRomCurve3(points)
    
        // sample a number of points on the curve
    
        let sampledPoints = curve.getPoints( this.numberOfSamples );
    
    
        this.curveGeometry =
    
                new THREE.BufferGeometry().setFromPoints( sampledPoints )
    
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
    
        this.lineObj.position.set(position.x,position.y,position.z)
    
        this.app.scene.add( this.lineObj );
    
    
    }


    /**

     * updates the contents

     * this method is called from the render method of the app

     *

     */

    update() {    

    }

}

export { MyContents };