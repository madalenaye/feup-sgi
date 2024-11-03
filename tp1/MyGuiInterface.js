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
        
        // Folders
        const cameraFolder = this.datgui.addFolder('Camera')
        const wallsFolder = this.datgui.addFolder('Walls Material'); 
        const tableFolder = this.datgui.addFolder( 'Table' );
        const musicFolder = this.datgui.addFolder('Music');
        const lightsFolder = this.datgui.addFolder('Lights');
        
        // Camera
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("active camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("z coord")
        cameraFolder.add(this.contents.axis, "visible", false).name("Axis")
        cameraFolder.add(this.contents, "cameraTarget", ["Cake", "Newspaper", "Coffee Machine", "Coffee Cup", "Ceilling Light"]).name("Target").onChange((value) => {this.contents.changeTarget(value)});
        cameraFolder.open()
        const sideOptions = {
            FrontSide: THREE.FrontSide,
            BackSide: THREE.BackSide,
            DoubleSide: THREE.DoubleSide
        };
        
        const sideNames = Object.keys(sideOptions);

        // Walls
        wallsFolder.addColor(this.contents.wallMaterialProperties, 'color').name('Color').onChange((value) => {this.contents.updateWallsColor(value)});
        wallsFolder.add(this.contents.wallMaterialProperties, 'roughness', 0, 1).name('Roughness').onChange((value => {this.contents.updateWallsRoughness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'metalness', 0, 1).name('Metalness').onChange((value => {this.contents.updateWallsMetalness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'clearcoat', 0, 1).name('Clearcoat').onChange((value => {this.contents.updateWallsClearcoat(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'clearcoatRoughness', 0, 1).name('ClearcoatRoughness').onChange((value => {this.contents.updateWallsClearcoatRoughness(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'reflectivity', 0, 1).name('Reflectivity').onChange((value => {this.contents.updateWallsReflectivity(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'opacity', 0, 1).name('Opacity').onChange((value => {this.contents.updateWallsOpacity(value)}));
        wallsFolder.add(this.contents.wallMaterialProperties, 'side', sideNames).name('Side').onChange((value => {this.contents.updateWallsSide(sideOptions[value])}));
        wallsFolder.open()
        
        //Table Position
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

        // Music
        const musicSettings = {PlayMusic: false};

        musicFolder.add(musicSettings, 'PlayMusic').name('Enable Music').onChange((value) => {
            if (value) {
                this.contents.musicPlayer.play(); 
            } else {
                this.contents.musicPlayer.stop(); 
            }
        });
        musicFolder.open();

        // Lights
        const lightParameters = {
            'spotlightIntensity': this.contents.lamp.spotlight.intensity,
            'spotlightAngle': this.contents.lamp.spotlight.angle,
            'bigStar': this.contents.ceilingLight.light.intensity,
            'smallStar': this.contents.ceilingLight2.light.intensity,
            'room': this.contents.pointLight.intensity,
            'roomColor': this.contents.pointLightColor,
            'candleFlame': this.contents.cake.candle.flameLight.intensity,
            'candleFlameColor': this.contents.cake.candle.flameLight.color
        }
        lightsFolder.add(lightParameters, 'spotlightIntensity', 0, 100).name('SpotLight Intensity').onChange((value) => {this.contents.lamp.spotlight.intensity = value});
        lightsFolder.add(lightParameters, 'spotlightAngle', 0, Math.PI/2).name('SpotLight Angle').onChange((value) => {this.contents.lamp.spotlight.angle = value});
        lightsFolder.add(lightParameters, 'bigStar', 0, 100).name('Big Star').onChange((value) => {this.contents.ceilingLight.light.intensity = value});
        lightsFolder.add(lightParameters, 'smallStar', 0, 100).name('Small Star').onChange((value) => {this.contents.ceilingLight2.light.intensity = value});
        lightsFolder.add(lightParameters, 'room', 0, 100).name('Room').onChange((value) => {this.contents.pointLight.intensity = value});
        lightsFolder.addColor(lightParameters, 'roomColor').name('Room Color').onChange((value) => {this.contents.updateRoomColor(value)});
        lightsFolder.add(lightParameters, 'candleFlame', 0, 100).name('Candle Flame').onChange((value) => {this.contents.cake.candle.flameLight.intensity = value});
        lightsFolder.addColor(lightParameters, 'candleFlameColor').name('Candle Flame Color').onChange((value) => {this.contents.cake.candle.flameLight.color.set(value)});

    }
}

export { MyGuiInterface };