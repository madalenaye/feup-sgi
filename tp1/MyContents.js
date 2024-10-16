import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { Plane } from './objects/Plane.js'
import {Table} from './objects/Table.js'
import {Candle} from './objects/Candle.js'
import {Plate} from './objects/Plate.js'
import {Cake} from './objects/Cake.js'
import { Window } from './objects/Window.js';

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

        // walls
        this.planeLeft = null
        this.planeRight = null
        this.planeFront = null
        this.planeBack = null

        // Table
        this.table = null

        // Candle
        this.candle = null;

        // Plate
        this.plate = null;

        // Cake
        this.cake = null;

        // Window
        this.window = null;

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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        

        // Common material for all walls
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xbcbcbc, 
            side: THREE.DoubleSide, 
            roughness: 0.5,
            metalness: 0.0
        });

        // Left side in relation to the x-axis
        this.planeLeft = new Plane(10, 6, material);
        this.planeLeft.buildLeftWall();
        this.app.scene.add(this.planeLeft);

        // Right side in relation to the x-axis
        this.planeRight = new Plane(10, 6, material);
        this.planeRight.buildRightWall();
        this.app.scene.add(this.planeRight);

        // Front side in relation to the x-axis
        this.planeFront = new Plane(10, 6, material);
        this.planeFront.buildFrontWall();
        this.app.scene.add(this.planeFront);
        
        // Back side in relation to the x-axis
        this.planeBack = new Plane(10, 6, material);
        this.planeBack.buildBackWall();
        this.app.scene.add(this.planeBack);

        // Floor
        this.floor = new Plane(10, 10, material);
        this.floor.buildFloor();
        this.app.scene.add(this.floor);
        
        // Table
        const woodTexture = this.prepareTexture('./Textures/wood_table.jpg');
        const metalTexture = this.prepareTexture('./Textures/metal_texture.jpg');

        const topMaterial = new THREE.MeshLambertMaterial({ map: woodTexture }); // Top material

        const legsMaterial = new THREE.MeshPhongMaterial({specular:"#dddddd", map: metalTexture, shininess: 100 }); // Leg material (metal)


        this.table = new Table(5, 0.2, 3,{ x: 0, y: 2, z: 3 }, topMaterial, legsMaterial);
        this.app.scene.add(this.table);

        // Candle
        const candleTexture = this.prepareTexture('./Textures/candle.jpg');
        const candleMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 0, map:candleTexture });

        const flameTexture = this.prepareTexture('./Textures/fire.jpg')
        const flameMaterial = new THREE.MeshLambertMaterial({map: flameTexture, emissive: 0xffa500, emissiveIntensity: 0.7, transparent: true, opacity: 0.8});
        
        this.candle = new Candle(0.1, 0.02, candleMaterial, 0.05, 0.01 , flameMaterial, { x: this.table.positionX, y: this.table.positionY 
                                                                                         + this.table.height, z: this.table.positionZ }); // in the center of table
                                                                                 
        this.app.scene.add(this.candle);

        // Plate
        this.plate = new Plate(0.4, 32);
        this.plate.position.set(this.table.positionX + 2, this.table.positionY + this.table.height + 0.07, this.table.positionZ);
        this.app.scene.add(this.plate);

        // Cake
        const cakeTexture = this.prepareTexture('./Textures/cake.jpg');
        const cakeMaterial = new THREE.MeshStandardMaterial({map:cakeTexture });
        this.cake = new Cake(0.5,0.3,Math.PI/8, cakeMaterial);
        this.cake.position.set(this.table.positionX + 2, this.table.positionY + this.table.height + 0.2, this.table.positionZ);
        this.app.scene.add(this.cake);

        // Window
        this.window = new Window(6, 3, 0.1, 'Textures/landscape2.jpg');
        this.window.position.set(0, this.planeRight.height/2, -((this.floor.width/2) - ((this.window.frameThickness/2) + 0.02)));
        this.app.scene.add(this.window);

    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    /**
     * Method that prepares the texture for the table top
     * @param {string} imagePath
     */
    prepareTexture(imagePath){
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(imagePath);

        return texture
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };