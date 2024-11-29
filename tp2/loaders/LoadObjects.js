import * as THREE from 'three';
import { loadMaterials } from './LoadMaterials.js';

export const loadObjects = {

    degreesToRadians(arrayDegrees) {
        for(let i = 0; i<3; i++){
            arrayDegrees[i] = (arrayDegrees[i] * Math.PI) / 180;
        }
        return arrayDegrees
    },

    loadNode(node, currentGroup){
        if(node.transformations.length > 0){
            node.transformations.forEach(transformation => {
                if (transformation.type === 'T') {
                    let parameters = transformation.translate;
                    currentGroup.position.set(parameters[0], parameters[1], parameters[2]);
                } else if (transformation.type === 'R') {
                    let parameters = loadObjects.degreesToRadians(transformation.rotation);
                    currentGroup.rotation.set(parameters[0], parameters[1], parameters[2]);     
                } else if (transformation.type === 'S') {
                    let parameters = transformation.scale;
                    currentGroup.scale.set(parameters[0], parameters[1], parameters[2]);
                }
            });
        }
        if(node.castShadows == null){
            currentGroup.castShadows = false;
        }
        else{
            currentGroup.castShadows = node.castShadows;
        }
        if(node.receiveShadows == null){
            currentGroup.receiveShadows = false;
        }
        else{
            currentGroup.receiveShadows = node.receiveShadows;
        }
    },

    loadLight(node, currentGroup){
        function configureLight(light, node) {
            light.color = new THREE.Color(node.color);
            light.intensity = node.intensity;
            light.position.set(node.position[0], node.position[1], node.position[2]);
            light.castShadow = node.castshadow;
    
            if (node.castshadow) {
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize.width = node.shadowmapsize;
                light.shadow.mapSize.height = node.shadowmapsize;
            }
        }

        let light;
        switch (node.type) {
            case "pointlight":
                light = new THREE.PointLight();
                light.distance = node.distance;
                light.decay = node.decay;
                break;

            case "spotlight":
                light = new THREE.SpotLight();
                light.distance = node.distance;
                light.angle = THREE.MathUtils.degToRad(node.angle);
                light.decay = node.decay;
                light.penumbra = node.penumbra;

                const target = new THREE.Object3D();
                target.position.set(node.target[0], node.target[1], node.target[2]);
                light.target = target;
                break;

            case "directionallight":
                light = new THREE.DirectionalLight();
                if (node.castshadow) {
                    light.shadow.camera.left = node.shadowleft;
                    light.shadow.camera.right = node.shadowright;
                    light.shadow.camera.bottom = node.shadowbottom;
                    light.shadow.camera.top = node.shadowtop;
                }
                break;

            default:
                console.warn(`Unknown light type: ${node.type}`);
                return;
        }

        configureLight(light, node);
        currentGroup.add(light);
    },

    createRectangule(parameters, material, castShadows, receiveShadows){
        let width =  Math.abs(parameters.xy2[0] - parameters.xy1[0]);
        let height = Math.abs(parameters.xy2[1] - parameters.xy1[1]);
        let newMaterial = null;
        if(material != null && material != undefined){
            newMaterial = loadMaterials.createMaterial(material, width, height);
        }
        else{
            throw new Error("Error in function createRectangule. Lack of material");
        }

        let rectanguleGeometry = new THREE.PlaneGeometry(width, height, parameters.parts_x, parameters.parts_y);
        let rectanguleMesh = new THREE.Mesh(rectanguleGeometry, newMaterial);
        rectanguleMesh.position.x = (parameters.xy2[0] + parameters.xy1[0])/2.0;
        rectanguleMesh.position.y = (parameters.xy2[1] + parameters.xy1[1])/2.0;

        rectanguleMesh.castShadow = castShadows ?? false;
        rectanguleMesh.receiveShadow = receiveShadows ?? false;

        return rectanguleMesh;
    },

    createBox(parameters, material, castShadows, receiveShadows){

        if(material == null || material == undefined){
            throw new Error("Error in function createBox. Lack of material");
        }

        let width = Math.abs(parameters.xyz2[0] - parameters.xyz1[0]);
        let height = Math.abs(parameters.xyz2[1] - parameters.xyz1[1]);
        let depth = Math.abs(parameters.xyz2[2] - parameters.xyz1[2]);

        let materials = [];

        let material1 = loadMaterials.createMaterial(material, depth, height);
        materials.push(material1);
        let material2 = loadMaterials.createMaterial(material, depth, height);
        materials.push(material2);

        let material3 = loadMaterials.createMaterial(material, width, depth);
        materials.push(material3);
        let material4 = loadMaterials.createMaterial(material, width, depth);
        materials.push(material4);

        let material5 = loadMaterials.createMaterial(material, width, height);
        materials.push(material5);
        let material6 = loadMaterials.createMaterial(material, width, height);
        materials.push(material6);

        let boxGeometry = new THREE.BoxGeometry(width, height, depth);
        let boxMesh = new THREE.Mesh(boxGeometry, materials);

        boxMesh.position.x = (parameters.xyz2[0] + parameters.xyz1[0]) / 2;
        boxMesh.position.y = (parameters.xyz2[1] + parameters.xyz1[1]) / 2;
        boxMesh.position.z = (parameters.xyz2[2] + parameters.xyz1[2]) / 2;

        boxMesh.castShadow = castShadows ?? false;
        boxMesh.receiveShadow = receiveShadows ?? false;

        return boxMesh;
    },

    createCylinder(parameters, material, castShadows, receiveShadows){

        if(material == null || material == undefined){
            throw new Error("Error in function createCylinder. Lack of material");
        }

        let texturesValues = [
            [2 * Math.PI * ((parameters.top + parameters.base) / 2), parameters.height],
            [2 * parameters.top, 2 * parameters.top],
            [2 * parameters.base, 2 * parameters.base],  
        ];

        let materials = []

        texturesValues.forEach(value => {
            let newMaterial = loadMaterials.createMaterial(material, value[0], value[1]);
            materials.push(newMaterial);
        });

        let cylinderGeometry = new THREE.CylinderGeometry(
                                parameters.top, 
                                parameters.base, 
                                parameters.height, 
                                parameters.slices, 
                                parameters.stacks, 
                                !parameters.capsclose, 
                                parameters.thetastart, 
                                parameters.thetalength);

        let cylinderMesh = new THREE.Mesh(cylinderGeometry, materials);

        cylinderMesh.castShadow = castShadows ?? false;
        cylinderMesh.receiveShadow = receiveShadows ?? false;

        return cylinderMesh;

    },

    createSphere(parameters, material, castShadows, receiveShadows){

        if(material == null || material == undefined){
            throw new Error("Error in function createSphere. Lack of material");
        }

        let newMaterial = loadMaterials.createMaterial(material, 2 * Math.PI * parameters.radius, 2 * Math.PI * parameters.radius);

        let phiLength = parameters.philength;
        if (phiLength !== 2 * Math.PI) {
            phiLength = THREE.MathUtils.degToRad(phiLength);
        }

        let thetaLength = parameters.thetalength;
        if (thetaLength !== 2 * Math.PI) {
            thetaLength = THREE.MathUtils.degToRad(thetaLength);
        }


        let sphereGeometry = new THREE.SphereGeometry(
                            parameters.radius, 
                            parameters.slices, 
                            parameters.stacks, 
                            THREE.MathUtils.degToRad(parameters.phistart), 
                            phiLength,
                            THREE.MathUtils.degToRad(parameters.thetastart), 
                            thetaLength
                        );

        let sphereMesh = new THREE.Mesh(sphereGeometry, newMaterial);

        sphereMesh.castShadow = castShadows ?? false;
        sphereMesh.receiveShadow = receiveShadows ?? false;

        return sphereMesh;
    },

    createObject(representations, nodeParent, currentGroup, organizeMaterials){
        switch (representations.subtype){
            case "rectangle":
                let retangule = loadObjects.createRectangule(representations, organizeMaterials[nodeParent.materialIds[0]], nodeParent.castShadows, nodeParent.receiveShadows);
                currentGroup.add(retangule);
                break;
            
            case "box":
                let box = loadObjects.createBox(representations, organizeMaterials[nodeParent.materialIds[0]], nodeParent.castShadows, nodeParent.receiveShadows);
                currentGroup.add(box);
                break;

            case "cylinder":
                let cylinder = loadObjects.createCylinder(representations, organizeMaterials[nodeParent.materialIds[0]], nodeParent.castShadows, nodeParent.receiveShadows);
                currentGroup.add(cylinder);
                break;

            case "sphere":
                let sphere = loadObjects.createSphere(representations, organizeMaterials[nodeParent.materialIds[0]], nodeParent.castShadows, nodeParent.receiveShadows);
                currentGroup.add(sphere);
                break;

            case "nurbs":
                break;
            
            case "triangle":
                break;

            case "polygon":
                break;

        }

    },

    loadObjects(rootNode, listObjects, organizeMaterials){

        let objects = {};

        function traverseDFS(node, parentGroup = null, organizeMaterials, nodeParent) {
            if (!node) return;

            const currentGroup = new THREE.Group();
            currentGroup.name = node.id;

            if (node.type === 'pointlight' || node.type === 'spotlight' || node.type === 'directionallight') {
                //console.log(`Light with type: ${node.type}`);
                loadObjects.loadLight(node, currentGroup);
            }
            else if (node.id) {
                //console.log(`ID: ${node.id}`);
                loadObjects.loadNode(node, currentGroup);
            }

            if (parentGroup) {
                parentGroup.add(currentGroup);
            }

            if(node.type === 'primitive'){
                //console.log(`Primitive with type: ${node.subtype}`)
                currentGroup.name = "primitive";
                const representation = node.representations[0];
                loadObjects.createObject(representation, nodeParent, currentGroup, organizeMaterials);
                // Criar primitiva
                //return;
            }

            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(childNode => {traverseDFS(childNode, currentGroup || null, organizeMaterials, node || null);});
            }
        }
        
        const rootObject = listObjects[rootNode];
        traverseDFS(rootObject, null, organizeMaterials, null);
    }
}