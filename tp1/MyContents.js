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
import { Lamp } from './objects/Lamp.js';
import { CoffeeTable } from './objects/CoffeeTable.js';
import { Chair } from './objects/Chair.js';
import { Cup } from './objects/Cup.js';
import { Door } from './objects/Door.js';
import { CoffeeMachine } from './objects/CoffeeMachine.js';
import { ShopSign } from './objects/ShopSign.js';
import { Counter } from './objects/Counter.js';
import { Rug } from './objects/Rug.js';
import { shadowDefinitions } from './utils/ShadowDefinitions.js';

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
        this.axisEnabled = true;

        // walls
        this.planeLeft = null
        this.planeRight = null
        this.planeFront = null
        this.planeBack = null
        this.wallMaterialProperties = null;

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
        this.flower2 = null;

        //Coffe table
        this.coffeeTable1 = null;
        this.coffeeTable2 = null;
        this.coffeeTable3 = null;

        //Chair
        this.chair1 = null;
        this.chair2 = null;
        this.chair3 = null;
        this.chair4 = null;
        this.chair5 = null;
        this.chair6 = null;
        this.chair7 = null;

        //Cup
        this.cup = null;
        this.cup2 = null;

        //Coffee Machine
        this.coffeeMachine = null;

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)
        
        // Lamp
        this.lamp = null;

        // Door
        this.door = null;

        // Shop Sign
        this.shopSign = null;

        // Counter
        this.counter = null;

        // Rug
        this.rug = null;

    }

    /**
     * builds the box mesh with material assigned
     */
    /*buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }*/

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
        const pointLight = new THREE.PointLight( 0xffffff, 10, 0, 1 );
        pointLight.position.set( 0, 10, 0 );
        shadowDefinitions.propertiesLightShadow(pointLight);
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        //this.buildBox()
        

        // Floor material
        this.floorTexture = new THREE.TextureLoader().load('./Textures/floor.jpg');
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(1,4);
        const floorMaterial = new THREE.MeshPhysicalMaterial({ 
            map: this.floorTexture,
            side: THREE.DoubleSide, 
            roughness: 0.5,
            metalness: 0.0,
            clearcoat: 0.1, 
            clearcoatRoughness: 0.3,
            reflectivity: 0.5 
        });

        // Floor
        this.floor = new Plane(15, 15, floorMaterial);
        this.floor.buildFloor();
        this.app.scene.add(this.floor);

        // Walls
        const wallsTexture = this.prepareTexture('./Textures/wall.jpg');

        wallsTexture.wrapS = THREE.RepeatWrapping;
        wallsTexture.wrapT = THREE.RepeatWrapping;
        wallsTexture.repeat.set(2, 2);
        this.wallMaterialProperties = {color: '#ffffff', roughness: 0.5, metalness: 0.0, side: THREE.FrontSide, clearcoat: 0.1, clearcoatRoughness: 0.3, reflectivity: 0.5, opacity: 1, transparent: true};
        
        this.wallsMaterial = new THREE.MeshPhysicalMaterial({  
            map: wallsTexture,
            color: this.wallMaterialProperties.color,
            roughness: this.wallMaterialProperties.roughness,
            metalness: this.wallMaterialProperties.metalness,
            clearcoat: this.wallMaterialProperties.clearcoat, 
            clearcoatRoughness: this.wallMaterialProperties.clearcoatRoughness,
            reflectivity: this.wallMaterialProperties.reflectivity,
            side: this.wallMaterialProperties.side,
            opacity: this.wallMaterialProperties.opacity,
            transparent: this.wallMaterialProperties.transparent
        });
    
        // Left side in relation to the x-axis
        this.planeLeft = new Plane(this.floor.width, 6, this.wallsMaterial);
        this.planeLeft.buildLeftWall(this.floor.height);
        this.app.scene.add(this.planeLeft);

        // Right side in relation to the x-axis
        this.planeRight = new Plane(this.floor.width, 6, this.wallsMaterial);
        this.planeRight.buildRightWall(this.floor.height);
        this.app.scene.add(this.planeRight);

        // Front side in relation to the x-axis
        this.planeFront = new Plane(this.floor.height, 6, this.wallsMaterial);
        this.planeFront.buildFrontWall(this.floor.width);
        this.app.scene.add(this.planeFront);
        
        // Back side in relation to the x-axis
        this.planeBack = new Plane(this.floor.height, 6, this.wallsMaterial);
        this.planeBack.buildBackWall(this.floor.width);
        this.app.scene.add(this.planeBack);
        
        // Table
        this.tableGroup = new THREE.Group();

        const woodTexture = this.prepareTexture('./Textures/wood.jpg');
        const metalTexture = this.prepareTexture('./Textures/metal_texture.jpg');

        const topMaterial = new THREE.MeshPhysicalMaterial({map: woodTexture, roughness: 0.7, metalness: 0.0, clearcoat: 0.1,clearcoatRoughness: 0.9}); // Top material

        const legsMaterial = new THREE.MeshPhysicalMaterial({map: metalTexture, roughness: 0.2, metalness: 0.7, reflectivity: 0.7, clearcoat: 0.3, clearcoatRoughness: 0.1});

        this.table = new Table(5, 0.2, 3,{ x: 0, y: 2.0, z: -3 }, topMaterial, legsMaterial);
        this.tableGroup.add(this.table);

        // Candle
        const candleTexture = this.prepareTexture('./Textures/candle.jpg');
        const candleMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 0, map:candleTexture });
        
        const flameMaterial = new THREE.MeshLambertMaterial({emissive: 0xffa500, emissiveIntensity: 1, transparent: false, shininess: 800});
        
        this.candle = new Candle(0.2, 0.02, candleMaterial, 0.010, flameMaterial, { x: this.table.positionX, y: this.table.positionY + this.table.height-0.055, z: this.table.positionZ} );                                                             
        this.tableGroup.add(this.candle);

        // Plate for Candle
        this.candlePlate = new Plate(this.candle.cylinderRadius * 2, 20);
        this.candlePlate.position.set(this.table.positionX, this.table.positionY + this.table.height -0.055, this.table.positionZ);
        this.tableGroup.add(this.candlePlate);

        // Plate
        this.plate = new Plate(0.4, 32);
        this.plate.position.set(this.table.positionX + 2, this.table.positionY + this.table.height - 0.012, this.table.positionZ);
        this.app.scene.add(this.plate);

        // Cake
        this.cakeTexture = new THREE.TextureLoader().load('./Textures/cake_frosting.png');
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeTexture.repeat.set(1, 1);

        this.cakeInsideTexture = new THREE.TextureLoader().load('./Textures/inside_cake.jpg');
        this.cakeInsideTexture.wrapS = THREE.RepeatWrapping;
        this.cakeInsideTexture.wrapT = THREE.RepeatWrapping;
        this.cakeInsideTexture.repeat.set(1, 1);

        this.cakeColor = "#a62121"
        this.cake = new Cake(0.45,0.3,Math.PI/5, this.cakeTexture, this.cakeInsideTexture, this.cakeColor);
        this.cake.position.set(this.table.positionX + 2, this.table.positionY + this.table.height + 0.14, this.table.positionZ);
        this.tableGroup.add(this.cake); 

        //Newspaper
        this.newspaper = new Newspaper(this.table.positionX - 1.8, this.table.positionY + 0.13, this.table.positionZ + 0.4);
        this.tableGroup.add(this.newspaper);

        // Spring
        this.spring = new Spring(0.1, 48, 0.04, 5);
        this.spring.position.set(this.table.positionX - 1 , this.table.positionY + this.table.height - 0.1, this.table.positionZ + 1);
        this.tableGroup.add(this.spring);

        // Lamp
        this.lamp = new Lamp(this.cake, "pink");
        this.lamp.position.set(this.table.positionX + 0.5, this.cake.position.y - 0.20, this.table.positionZ);
        this.lamp.rotation.y = Math.PI/2;
        this.tableGroup.add(this.lamp);

        this.app.scene.add(this.tableGroup);

        // Window
        this.window = new Window(6, 3, 0.1, 'Textures/landscape2.jpg');
        this.window.position.set(0, this.planeRight.height/2, -((this.floor.height/2) - ((this.window.frameThickness/2) + 0.02)));
        this.app.scene.add(this.window);

        this.rectLight = this.window.activateWindowLight()
        this.app.scene.add(this.rectLight);

        this.shadowLight = this.window.activateShadowLight()
        this.app.scene.add(this.shadowLight);

        const dirLightHelper = new THREE.DirectionalLightHelper(this.shadowLight, 5);
        const shadowHelper = new THREE.CameraHelper(this.shadowLight.shadow.camera);

        // 1st Painting

        this.painting = new Painting(1.3, 1.5, 0.1, 'Textures/pikachu.jpg');
        this.painting.position.set(this.floor.width/2 - 0.05, this.planeFront.height/2 + 0.1, this.planeFront.position.z);
        this.painting.rotateY(-Math.PI/2);
        this.app.scene.add(this.painting);

        // 2nd Painting
        this.painting2 = new Painting(1.3, 1.5, 0.1, 'Textures/cat.jpg');
        this.painting2.position.set(this.floor.width/2 - 0.05, this.planeFront.height/2 + 0.1, this.planeFront.position.z + 1.5);
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

        // Jar
        this.jar = new Jar();
        this.jar.position.set(this.floor.width/2 - 0.7, this.floor.position.y + 0.5, -this.floor.height/2 + 0.7);
        this.app.scene.add(this.jar);

        this.jar2 = new Jar(); 
        this.jar2.position.set(this.floor.width/2 - 0.7, this.floor.position.y + 0.5, this.floor.height/2 - 0.7);
        this.app.scene.add(this.jar2)

        //Flower
        const stemMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });
        const flowerCenterMaterial = new THREE.MeshBasicMaterial({ color: 0x260851 , side: THREE.DoubleSide });
        const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xc81f07  });
        this.flower = new Flower(64, 0.1, 8, this.jar.position.x, 0.01, this.jar.position.z, stemMaterial, flowerCenterMaterial, petalMaterial, 0.4, 10);
        this.app.scene.add(this.flower);
        
        const flowerCenterMaterial2 = new THREE.MeshBasicMaterial({ color: 0xd77fce , side: THREE.DoubleSide });
        const petalMaterial2 = new THREE.MeshBasicMaterial({ color: 0xf0bb16 });
        this.flower2 = new Flower(64, 0.1, 8, this.jar2.position.x - 0.1, 0.01, this.jar2.position.z, stemMaterial, flowerCenterMaterial2, petalMaterial2, 0.42, 10)
        this.app.scene.add(this.flower2);

        // Coffee Table
        const topTableTexture = this.prepareTexture("./Textures/topTable.jpg");
        const topMaterial2 = new THREE.MeshPhysicalMaterial({map: topTableTexture, roughness: 0.6, metalness: 0.1, reflectivity: 0.2, clearcoat: 0.3, clearcoatRoughness: 0.2, sheen: 0.4, sheenRoughness: 0.8});

        this.coffeeTable1 = new CoffeeTable(2.0, 0.1, 2.0,topMaterial2, 0.1, 2, 0.15, {x : -(this.floor.width/2 - 1.0) + 0.4, z: 0});
        this.app.scene.add(this.coffeeTable1); 

        this.coffeeTable2 = new CoffeeTable(2.0, 0.1, 2.0, topMaterial2, 0.1, 2, 0.15, {x: this.coffeeTable1.positionX, z: this.floor.height/2 - 2.5})
        this.app.scene.add(this.coffeeTable2); 

        this.coffeeTable3 = new CoffeeTable(2.0, 0.1, 2.0, topMaterial2, 0.1, 2, 0.15, {x: this.coffeeTable1.positionX, z: -(this.floor.height/2 - 2.5)})
        this.app.scene.add(this.coffeeTable3); 

        // Chairs
        const seatTexture = this.prepareTexture("./Textures/seatChair2.jpg");
        const seatMaterial = new THREE.MeshPhongMaterial({ map: seatTexture, shininess: 3,specular: 0x799f52 });
        this.buildSceneChairs(seatMaterial, topMaterial2);
    
        // Cup
        const cupTexture = this.prepareTexture("./Textures/cup.jpg");
        cupTexture.wrapS = THREE.RepeatWrapping;
        cupTexture.wrapT = THREE.RepeatWrapping;
        cupTexture.repeat.set(2, 1); 

        const cupMaterial = new THREE.MeshPhongMaterial({map: cupTexture, color: 0xffffff,emissive: 0x333333,shininess: 200,side: THREE.DoubleSide }); 
        this.cup = new Cup(0.1, 0.05, 0.1, 0.05, cupMaterial, this.coffeeTable2.positionX, this.coffeeTable2.height + this.coffeeTable2.tableHeight + 0.1/2, this.coffeeTable2.positionZ - 0.5, true);
        this.app.scene.add(this.cup);

        this.cup2 = new Cup(0.1, 0.05, 0.1, 0.05, cupMaterial, this.coffeeTable1.positionX - 0.3, this.coffeeTable1.height + this.coffeeTable1.tableHeight + 0.15, this.coffeeTable1.positionZ, false, Math.PI/16)
        this.app.scene.add(this.cup2);

        const coffeStain = this.cup2.createCoffeeStain(this.coffeeTable1.positionX - 0.2, this.coffeeTable1.height + this.coffeeTable1.tableHeight + 0.06, this.coffeeTable1.positionZ);
        this.app.scene.add(coffeStain);

        // Door
        this.door = new Door(this.planeLeft.width * 0.2, this.planeLeft.height / 1.3);
        this.door.position.set(0, this.planeLeft.position.y - 0.85 - (this.door.height / 2 + 0.05), this.planeLeft.position.z - 0.05);
        this.door.rotation.y = Math.PI / 2;
        this.app.scene.add(this.door);
        
        const coffeeStain = this.cup2.createCoffeeStain(this.coffeeTable1.positionX - 0.2, this.coffeeTable1.height + this.coffeeTable1.tableHeight + 0.06, this.coffeeTable1.positionZ);
        this.app.scene.add(coffeeStain);

        // Shop Sign
        this.shopSign = new ShopSign("The Coffee™ Shop");
        this.shopSign.position.set(this.door.position.x + 1.9, this.planeFront.height/2 + 1.9, this.planeLeft.position.z - 0.01);
        this.app.scene.add(this.shopSign);

        // Counter
        this.counter = new Counter();
        this.counter.position.set(this.planeFront.position.x - 2.5, this.floor.position.y + 1.1, this.painting.position.z + 0.8);
        this.app.scene.add(this.counter);

        // Coffee Machine
        this.coffeeMachine = new CoffeeMachine(this.counter.position.x + 0.25, 2.50, this.counter.position.z - 1.5, 1);
        this.coffeeMachine.rotation.y = Math.PI/2;
        this.coffeeMachine.scale.set(0.75, 0.75, 0.75);
        this.app.scene.add(this.coffeeMachine);

        // Rug
        const rugTexture = this.prepareTexture("./Textures/rug.jpg")
        rugTexture.center.set(0.5, 0.5); 
        rugTexture.rotation = Math.PI / 2; 
        const rugMaterial = new THREE.MeshStandardMaterial({ map: rugTexture, roughness: 0.8, metalness: 0.1});

        this.rug = new Rug(7, 0.03, 4, rugMaterial, 0, 0.03, 4);
        this.app.scene.add(this.rug);
    }

    /**
     * Method responsible for constructing the chair scene.
     * @method
     * @param {THREE.Material} seatMaterial - Material to be applied to the chair seats.
     * @param {THREE.Material} legsMaterial - Material to be applied to the chair legs.
     */
    buildSceneChairs(seatMaterial, legsMaterial){
        //Chairs - table 2
        this.chair1 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, this.coffeeTable2.positionZ - this.coffeeTable2.tableWidth/2, 0);
        this.app.scene.add(this.chair1);

        this.chair2 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, this.coffeeTable2.positionZ + this.coffeeTable2.tableWidth/2, Math.PI);
        this.app.scene.add(this.chair2);

        this.chair3 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX + (this.coffeeTable2.tableWidth/2 + 0.3), this.coffeeTable2.positionZ, 3*Math.PI/2);
        this.app.scene.add(this.chair3);

        //Chairs - table 1
        this.chair4 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, - (this.coffeeTable2.tableWidth/2 + 0.4), Math.PI/4);
        this.app.scene.add(this.chair4);

        this.chair5 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, (this.coffeeTable2.tableWidth/2 + 0.4), Math.PI - Math.PI/4);
        this.app.scene.add(this.chair5);

        //Chairs - table 3
        this.chair6 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, -this.coffeeTable2.positionZ - this.coffeeTable2.tableWidth/2, 0);
        this.app.scene.add(this.chair6);

        this.chair7 = new Chair(1.2, 1.2, 0.1, seatMaterial, 0.05, 1.4, legsMaterial, this.coffeeTable2.positionX, -this.coffeeTable2.positionZ + this.coffeeTable2.tableWidth/2, Math.PI);
        this.app.scene.add(this.chair7);
    }

    /**
     * Method to update the visibility of the axes
     * @method
     */
    toggleAxisVisibility() {
        if (this.axis) {
            this.axis.setVisible(this.axisEnabled);
        }
    }

    /**
     * Method to update the colour of the walls' material.
     * @method
     * @param {THREE.Color} value 
     */
    updateWallsColor(value){
        this.wallMaterialProperties.color = value
        this.wallsMaterial.color.set(this.wallMaterialProperties.color)
    }

    /**
     * Method to update the roughness of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsRoughness(value){
        this.wallMaterialProperties.roughness = value
        this.wallsMaterial.roughness = this.wallMaterialProperties.roughness
    }

    /**
     * Method to update the metalness of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsMetalness(value){
        this.wallMaterialProperties.metalness = value
        this.wallsMaterial.metalness = this.wallMaterialProperties.metalness
    }

    /**
     * Method to update the clearcoat of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsClearcoat(value){
        this.wallMaterialProperties.clearcoat = value
        this.wallsMaterial.clearcoat = this.wallMaterialProperties.clearcoat
    }

    /**
     * Method to update the clearcoatRoughness of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsClearcoatRoughness(value){
        this.wallMaterialProperties.clearcoatRoughness = value
        this.wallsMaterial.clearcoatRoughness = this.wallMaterialProperties.clearcoatRoughness
    }

    /**
     * Method to update the reflectivity of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsReflectivity(value){
        this.wallMaterialProperties.reflectivity = value
        this.wallsMaterial.reflectivity = this.wallMaterialProperties.reflectivity
    }

    /**
     * Method to update the opacity of the walls' material.
     * @method
     * @param {number} value 
     */
    updateWallsOpacity(value){
        this.wallMaterialProperties.opacity = value;
        this.wallsMaterial.opacity = this.wallMaterialProperties.opacity;
    }

    /**
     * Method to update the side of the walls' material.
     * @method
     * @param {number} value - The side property, which should be one of THREE.FrontSide (0), THREE.BackSide (1), or THREE.DoubleSide (2).
     */
    updateWallsSide(value){
        this.wallMaterialProperties.side = value;
        this.wallsMaterial.side = this.wallMaterialProperties.side;
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
    /*rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }*/
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    
    /*updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }*/

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
       /*this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        */
    }

}

export { MyContents };