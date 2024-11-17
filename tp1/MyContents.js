import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        //const ambientLight = new THREE.AmbientLight( 0x555555 );
        //this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        //this.app.scene.add( this.planeMesh );

        //Grupo principal scene
        const groupScene = new THREE.Group();
        const ambientLight = new THREE.AmbientLight( 0x555555 )
        groupScene.add(ambientLight);

        //Criar o grupo esferaSuperior que vai começar por ter a semiesfera inferior
        const esferaSuperior = new THREE.Group();

        //Criar a semiesfera
        const radius = 4;
        const widthSegments = 32;
        const heightSegments = 16; 
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI / 2); 
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xc82f23, specular: 0xffffff, shininess: 10, emissive: 0x222222, 
                                                            transparent: false, wireframe: false, side: THREE.DoubleSide,
                                                            opacity: 1.0 });
        const esferaSuperiorFIG = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // Adicionar a semiesfera ao grupo
        esferaSuperior.add(esferaSuperiorFIG);
        esferaSuperior.position.set(0,11,0);
        groupScene.add(esferaSuperior)

        //Criar o grupo para cilindro da esfera superior
        const groupCilindro = new THREE.Group();
        //const cilindroMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false, side: THREE.DoubleSide });
        const cilindroMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,     
            specular: 0xffffff,  
            shininess: 15,
            emissive: 0x000000,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide
          });

        const height = 0.5; 
        const radialSegments = 32;  
        const heightSegments2 = 1;  

        const cylinderGeometry = new THREE.CylinderGeometry(3.8, 3.8, height, radialSegments, heightSegments2);
        const cylinder = new THREE.Mesh(cylinderGeometry, cilindroMaterial);
        groupCilindro.add(cylinder);
        groupCilindro.position.set(0,-0.25,0);
        esferaSuperior.add(groupCilindro);

        // Criar um grupo para o circulo preto e adicionar no grupo da cilindro
        const groupCirculo = new THREE.Group();
        const circuloMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false, side: THREE.DoubleSide });

        const segments = 32; 
        const circleGeometry = new THREE.CircleGeometry(0.7, segments);
        const circulo = new THREE.Mesh(circleGeometry, circuloMaterial);
        groupCirculo.add(circulo);
        groupCirculo.position.set(0,-0.5,3.8);
        groupCilindro.add(groupCirculo);

        // Criar um grupo para o cilindro branco e adicionar ao grupo do circulo preto
        const groupCilindroBranco = new THREE.Group();
        const cilindroMaterial2 = new THREE.MeshPhongMaterial({
            color: 0xeae1e1,   
            specular: 0xffffff,
            shininess: 40,
            emissive: 0x555555,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
          });

        const cylinderGeometry2 = new THREE.CylinderGeometry(0.4, 0.4, 0.08, radialSegments, heightSegments2);
        const cylinder2 = new THREE.Mesh(cylinderGeometry2, cilindroMaterial2);

        groupCilindroBranco.add(cylinder2);
        groupCilindroBranco.rotation.set(Math.PI/2, 0, 0);
        groupCilindroBranco.position.set(0,0,0.05);
        groupCirculo.add(groupCilindroBranco);

        //----------------------------------------------------------------------------------

        //Criar esfera inferior e respetivo grupo
        const esferaMaterial2 = new THREE.MeshPhongMaterial({
            color: 0xe0e8e3,         
            specular: 0xffffff,       
            shininess: 10,           
            emissive: 0xbdb8b8,       
            transparent: false,       
            opacity: 1.0,            
            side: THREE.DoubleSide    
          });
        const groupEsferaInferior= new THREE.Group();
        const sphere2Geometry = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const esferaInferiorFIG = new THREE.Mesh(sphere2Geometry, esferaMaterial2);

        groupEsferaInferior.add(esferaInferiorFIG);
        groupEsferaInferior.rotation.set(Math.PI, 0, 0);
        groupEsferaInferior.position.set(0,4,0);
        groupScene.add(groupEsferaInferior);

        //Criar cilindro para chão e respetivo grupo
        const groupChao = new THREE.Group();
        const textureLoader = new THREE.TextureLoader();
        const textura = textureLoader.load('./grass.png');
        const chaoMaterial = new THREE.MeshPhongMaterial({
            map: textura,
            color: 0xffffff, 
            specular: 0x222222,
            shininess: 3, 
            emissive: 0x001100,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide
          });
        const chaoGeometry = new THREE.CylinderGeometry(3.98, 3.80, 0.1, 32, 1);
        const chao= new THREE.Mesh(chaoGeometry, chaoMaterial);

        groupChao.add(chao)
        groupChao.position.set(0,0.14,0);
        groupEsferaInferior.add(groupChao);

        this.app.scene.add(groupScene)


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