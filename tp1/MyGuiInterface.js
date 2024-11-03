/**
 * @file MyGuiInterface.js
 * @class MyGuiInterface
 * @desc This class manages and customizes the graphical user interface (GUI) for the application.
 */

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

/**
 * @class
 * @classdesc This class customizes the gui interface for the app
 */

class MyGuiInterface  {

    /**
     * Constructs a GUI interface for the application, enabling user interaction with the scene.
     * @constructor
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @method
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     * @method
     */
    init() {

        /*
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();
        */

        const wallsFolder = this.datgui.addFolder('Walls Material');
        const sideOptions = {
            FrontSide: THREE.FrontSide,
            BackSide: THREE.BackSide,
            DoubleSide: THREE.DoubleSide
        };
        
        const sideNames = Object.keys(sideOptions);

        wallsFolder.addColor(this.contents.wallMaterialProperties, 'color').name('Color').onChange((value) => {this.contents.updateWallsColor(value)});
        wallsFolder.add(this.contents.wallMaterialProperties, 'roughness', 0, 1).name('Roughness').onChange((value => {this.contents.updateWallsRoughness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'metalness', 0, 1).name('Metalness').onChange((value => {this.contents.updateWallsMetalness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'clearcoat', 0, 1).name('Clearcoat').onChange((value => {this.contents.updateWallsClearcoat(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'clearcoatRoughness', 0, 1).name('ClearcoatRoughness').onChange((value => {this.contents.updateWallsClearcoatRoughness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'reflectivity', 0, 1).name('Reflectivity').onChange((value => {this.contents.updateWallsReflectivity(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'opacity', 0, 1).name('Opacity').onChange((value => {this.contents.updateWallsOpacity(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'side', sideNames).name('Side').onChange((value => {this.contents.updateWallsSide(sideOptions[value])}));
        wallsFolder.open()

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("z coord")
        cameraFolder.add(this.contents, 'axisEnabled').name("Axis").onChange(() => {
            this.contents.toggleAxisVisibility();
        });
        cameraFolder.open()

        const tableFolder = this.datgui.addFolder( 'Table' );

        //Position
        tableFolder.add(this.contents.tableGroup.position, 'x', -5, 5).name("Translation x")
        tableFolder.add(this.contents.tableGroup.position, 'y', -5, 5).name("Translation y")
        tableFolder.add(this.contents.tableGroup.position, 'z', -5, 5).name("Translation z")

        tableFolder.add({ rotationX: THREE.MathUtils.radToDeg(this.contents.tableGroup.rotation.x) }, 'rotationX', 0, 360)
        .name('Rotation x')
        .onChange(deg => this.contents.tableGroup.rotation.x = THREE.MathUtils.degToRad(deg));

        tableFolder.add({ rotationY: THREE.MathUtils.radToDeg(this.contents.tableGroup.rotation.y) }, 'rotationY', 0, 360)
        .name('Rotation y')
        .onChange(deg => this.contents.tableGroup.rotation.y = THREE.MathUtils.degToRad(deg));
        
        tableFolder.add({ rotationZ: THREE.MathUtils.radToDeg(this.contents.tableGroup.rotation.z) }, 'rotationZ', 0, 360)
        .name('Rotation z')
        .onChange(deg => this.contents.tableGroup.rotation.z = THREE.MathUtils.degToRad(deg));

        tableFolder.open()
    }
}

export { MyGuiInterface };