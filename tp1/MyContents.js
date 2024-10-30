import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { Plane } from './objects/Plane.js'
import {Table} from './objects/Table.js'
import {Candle} from './objects/Candle.js'
import {Plate} from './objects/Plate.js'
import {Cake} from './objects/Cake.js'
import { Window } from './objects/Window.js';
import { Painting } from './objects/Painting.js';
import { Baseboard } from './objects/Baseboard.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { Beetle } from './objects/Beetle.js';
import { Newspaper } from './objects/Newspaper.js';
import {Flower} from './objects/Flower.js';
import { Spring } from './objects/Spring.js';
import { Jar } from './objects/Jar.js';
import { CoffeTable } from './objects/CoffeTable.js';
import { Chair } from './objects/Chair.js';

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

        // CandlePlate
        this.candlePlate = null;

        // Plate
        this.plate = null;

        // Cake
        this.cake = null;

        // Window
        this.window = null;

        // Baseboards
        this.baseboardLeft = null;
        this.baseboardRight = null;
        this.baseboardFront = null
        this.baseboardBack = null

        // Beetle
        this.beetle = null;

        //Newspaper
        this.newspaper = null;

        //Flower
        this.flower = null;

        //Coffe table
        this.coffeTable1 = null;
        this.coffeTable2 = null;
        this.coffeTable3 = null;

        //Chair
        this.chair1 = null;
        this.chair2 = null;
        this.chair3 = null;
        this.chair4 = null;
        this.chair5 = null;
        this.chair6 = null;
        this.chair7 = null;

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
        

        // Floor material
        const floorMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xbcbcbc, 
            side: THREE.DoubleSide, 
            roughness: 0.5,
            metalness: 0.0,
            clearcoat: 0.1, 
            clearcoatRoughness: 0.3,
            reflectivity: 0.5 
        });

        // Floor
        this.floor = new Plane(15, 20, floorMaterial);
        this.floor.buildFloor();
        this.app.scene.add(this.floor);

        // Walls
        const wallsTexture = this.prepareTexture('./Textures/wall.jpg');

        wallsTexture.wrapS = THREE.RepeatWrapping;
        wallsTexture.wrapT = THREE.RepeatWrapping;
        wallsTexture.repeat.set(2, 2);

        const wallsMaterial = new THREE.MeshPhysicalMaterial({  
            map: wallsTexture,
            color: 0xffffff,
            side: THREE.DoubleSide, 
            roughness: 0.5,
            metalness: 0.0,
            clearcoat: 0.1, 
            clearcoatRoughness: 0.3,
            reflectivity: 0.5 
        });

        // Left side in relation to the x-axis
        this.planeLeft = new Plane(this.floor.width, 6, wallsMaterial);
        this.planeLeft.buildLeftWall(this.floor.height);
        this.app.scene.add(this.planeLeft);

        // Right side in relation to the x-axis
        this.planeRight = new Plane(this.floor.width, 6, wallsMaterial);
        this.planeRight.buildRightWall(this.floor.height);
        this.app.scene.add(this.planeRight);

        // Front side in relation to the x-axis
        this.planeFront = new Plane(this.floor.height, 6, wallsMaterial);
        this.planeFront.buildFrontWall(this.floor.width);
        this.app.scene.add(this.planeFront);
        
        // Back side in relation to the x-axis
        this.planeBack = new Plane(this.floor.height, 6, wallsMaterial);
        this.planeBack.buildBackWall(this.floor.width);
        this.app.scene.add(this.planeBack);
        
        // Table
        const woodTexture = this.prepareTexture('./Textures/wood.jpg');
        const metalTexture = this.prepareTexture('./Textures/metal_texture.jpg');

        const topMaterial = new THREE.MeshLambertMaterial({ map: woodTexture }); // Top material

        const legsMaterial = new THREE.MeshPhongMaterial({specular:"#dddddd", map: metalTexture, shininess: 100 }); // Leg material (metal)

        this.table = new Table(5, 0.2, 3,{ x: 0, y: 2, z: 3 }, topMaterial, legsMaterial);
        this.app.scene.add(this.table);

        // Candle
        const candleTexture = this.prepareTexture('./Textures/candle.jpg');
        const candleMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 0, map:candleTexture });
        
        const flameMaterial = new THREE.MeshLambertMaterial({emissive: 0xffa500, emissiveIntensity: 1, transparent: false, shininess: 800});
        
        this.candle = new Candle(0.2, 0.02, candleMaterial, 0.010, flameMaterial, { x: this.table.positionX, y: this.table.positionY 
                                                                                         + this.table.height + 0.02, z: this.table.positionZ }); // in the center of table                                                               
        this.app.scene.add(this.candle);

        // Plate for Candle
        this.candlePlate = new Plate(this.candle.cylinderRadius * 2, 20);
        this.candlePlate.position.set(this.table.positionX, this.table.positionY + this.table.height + 0.02, this.table.positionZ);
        this.app.scene.add(this.candlePlate);

        // Plate
        this.plate = new Plate(0.4, 32);
        this.plate.position.set(this.table.positionX + 2, this.table.positionY + this.table.height + 0.07, this.table.positionZ);
        this.app.scene.add(this.plate);

        // Cake
        const cakeTexture = this.prepareTexture('./Textures/cake.jpg');
        const cakeMaterial = new THREE.MeshStandardMaterial({map:cakeTexture });
        this.cake = new Cake(0.45,0.3,Math.PI/8, cakeMaterial);
        this.cake.position.set(this.table.positionX + 2, this.table.positionY + this.table.height + 0.2, this.table.positionZ);
        this.app.scene.add(this.cake);

        // Window
        this.window = new Window(6, 3, 0.1, 'Textures/landscape2.jpg');
        this.window.position.set(0, this.planeRight.height/2, -((this.floor.height/2) - ((this.window.frameThickness/2) + 0.02)));
        this.app.scene.add(this.window);

        this.rectLight = this.window.activateWindowLight()
        this.app.scene.add(this.rectLight);

        //const helper = new RectAreaLightHelper( this.rectLight );
        //this.rectLight.add( helper );

        // 1st Painting

        this.painting = new Painting(1.3, 1.5, 0.1, 'Textures/pikachu.jpg');
        this.painting.position.set(this.floor.width/2 - 0.1, this.planeFront.height/2 + 0.1, this.planeFront.position.z);
        this.painting.rotateY(-Math.PI/2);
        this.app.scene.add(this.painting);

        // 2nd Painting
        this.painting2 = new Painting(1.3, 1.5, 0.1, 'Textures/cat.jpg');
        this.painting2.position.set(this.floor.width/2 - 0.1, this.planeFront.height/2 + 0.1, this.planeFront.position.z + 1.5);
        this.painting2.rotateY(-Math.PI/2);
        this.app.scene.add(this.painting2);

        // Baseboard
        const baseboardMaterial = new THREE.MeshStandardMaterial({color: 0x5f3b3b});

        this.baseboardLeft = new Baseboard(this.floor.width - 0.01, 0.2, 0.05, baseboardMaterial);
        this.baseboardLeft.buildLeftBaseboard(this.floor.position.y, this.floor.height);
        this.app.scene.add(this.baseboardLeft);

        this.baseboardRight = new Baseboard(this.floor.width - 0.01, 0.2, 0.05, baseboardMaterial);
        this.baseboardRight.buildRightBaseboard(this.floor.position.y, this.floor.height);
        this.app.scene.add(this.baseboardRight);

        this.baseboardFront = new Baseboard((this.floor.height - 0.01), 0.2, 0.05, baseboardMaterial)
        this.baseboardFront.buildFrontBaseboard(this.floor.position.y, this.floor.width);
        this.app.scene.add(this.baseboardFront);

        this.baseboardBack = new Baseboard((this.floor.height - 0.01), 0.2, 0.05, baseboardMaterial)
        this.baseboardBack.buildBackBaseboard(this.floor.position.y, this.floor.width);
        this.app.scene.add(this.baseboardBack);

        // Beetle
        this.beetle = new Beetle(-this.floor.width/2, 3, 0, 0.25, 48);
        this.app.scene.add(this.beetle);

        //Newspaper
        this.newspaper = new Newspaper(this.table.positionX - 1.8,this.table.positionY+0.2,this.table.positionZ+0.4);
        this.app.scene.add(this.newspaper);

        // Spring
        this.spring = new Spring(0.1, 48, 0.04, 5);
        this.spring.position.set(this.table.positionX - 1 , this.table.positionY + this.table.height, this.table.positionZ + 1);
        this.app.scene.add(this.spring);

        // Jar
        this.jar = new Jar();
        this.jar.position.set(this.floor.width/2 - 0.7, this.floor.position.y + 0.5, -this.floor.height/2 + 0.7);
        this.app.scene.add(this.jar);

        //Flower
        const stemMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });
        const flowerCenterMaterial = new THREE.MeshBasicMaterial({ color: 0x260851 , side: THREE.DoubleSide });
        const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xc81f07  });
        console.log(this.jar.position.x);
        console.log(this.jar.position.z);
        this.flower = new Flower(64, 0.1, 8, this.jar.position.x, 0.01, this.jar.position.z, stemMaterial, flowerCenterMaterial, petalMaterial, 0.4);

        this.app.scene.add(this.flower);

        // Coffe Table
        const topTableTexture = this.prepareTexture("./Textures/topTable.jpg");
        const topMaterial2 = new THREE.MeshLambertMaterial({ map: topTableTexture });

        this.coffeTable1 = new CoffeTable(2.0, 0.1, 2.0,topMaterial2, 0.1, 2, 0.15, {x : -(this.floor.width/2 - 1.0) + 0.4, z: 0});
        this.app.scene.add(this.coffeTable1); 

        this.coffeTable2 = new CoffeTable(2.0, 0.1, 2.0, topMaterial2, 0.1, 2, 0.15, {x: this.coffeTable1.positionX, z: this.floor.height/2 - 4})
        this.app.scene.add(this.coffeTable2); 

        this.coffeTable3 = new CoffeTable(2.0, 0.1, 2.0, topMaterial2, 0.1, 2, 0.15, {x: this.coffeTable1.positionX, z: -(this.floor.height/2 - 4)})
        this.app.scene.add(this.coffeTable3); 

        // Chairs
        //Chairs - table 2
        this.chair1 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, this.coffeTable2.positionZ - this.coffeTable2.tableWidth/2, 0);
        this.app.scene.add(this.chair1);

        this.chair2 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, this.coffeTable2.positionZ + this.coffeTable2.tableWidth/2, Math.PI);
        this.app.scene.add(this.chair2);

        this.chair3 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX + (this.coffeTable2.tableWidth/2 + 0.3), this.coffeTable2.positionZ, 3*Math.PI/2);
        this.app.scene.add(this.chair3);

        //Chairs - table 1
        this.chair4 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, - (this.coffeTable2.tableWidth/2 + 0.4), Math.PI/4);
        this.app.scene.add(this.chair4);

        this.chair5 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, (this.coffeTable2.tableWidth/2 + 0.4), Math.PI - Math.PI/4);
        this.app.scene.add(this.chair5);

        //Chairs - table 3
        this.chair6 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, -this.coffeTable2.positionZ - this.coffeTable2.tableWidth/2, 0);
        this.app.scene.add(this.chair6);

        this.chair7 = new Chair(1.2, 1.2, 0.1, topMaterial2, 0.05, 1.4, this.coffeTable2.positionX, -this.coffeTable2.positionZ + this.coffeTable2.tableWidth/2, Math.PI);
        this.app.scene.add(this.chair7);
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