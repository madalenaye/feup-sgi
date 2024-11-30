import * as THREE from 'three';
import { loadMaterials } from './LoadMaterials.js';
import {nurbsSurface} from '../utils/NurbsSurface.js'

export const loadObjects1 = {
    load: function(data, materials){
        const root = data
        if (root == null) return
        let scene = dealWithNodes(root, null, materials)
        return scene
    }
}

const dealWithNodes = function(node, materialId=null, materials){
    if (node == null) return
    const group = new THREE.Group();
    if (node.type == "lod"){
        const lod = new THREE.LOD()
        for (let child of node.children){
            const childGroup = dealWithNodes(child.node, materialId, materials);
            lod.addLevel(childGroup, child.mindist);
        }
        return lod;
    }
    else if (node.type == "node"){
        let material = null;
        material = node.materialIds.length !== 0 ? materials[node.materialIds[0]] : materialId;

        for (let key in node.children){
            if (node.children[key].type == 'node'){
                let child = node.children[key]
                if (node.castshadow) child.castshadow = true;
                if (node.receiveshadow) child.receiveshadow = true;
                const childGroup = dealWithNodes(child, material, materials);
                group.add(childGroup);
            }
        
           else if (node.children[key].type == 'lod'){
                let child = node.children[key]
                if (node.castShadows) child.castShadows = true;
                if (node.receiveShadows) child.receiveShadows = true;
                const childGroup = dealWithNodes(child, material, materials);
                group.add(childGroup);
            }
           
           else{
                const child = node.children[key]
                let castShadow = node.castShadows;
                let receiveShadow = node.ReceiveShadows;

                switch(child.type){
                    case 'pointlight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let pointLight = buildPointLight(child);
                        group.add(pointLight);
                        break;
                    case 'spotlight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let spotLight = buildSpotLight(child);
                        group.add(spotLight);
                        break;
                    
                    case 'directionallight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let directionalLight = buildDirectionalLight(child);
                        group.add(directionalLight);
                        break;
                    case 'primitive':
                        let primitive = null;
                        switch(child.subtype){
                            case 'rectangle':
                                primitive = createRectangle(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'box':
                                primitive = createBox(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'cylinder':
                                primitive = createCylinder(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'sphere':
                                primitive = createSphere(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'nurbs':
                                primitive = createNurb(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            default:
                                throw new Error('Invalid primitive type ' + child.subtype);
                        }
                        group.add(primitive);
                        break;
                    default:
                        throw new Error('Invalid node type');
                }
            }
        }
    }
    dealWithTransformations(group, node.transformations);
    return group;
}

const dealWithTransformations = function(group, transformations){
    for (let key in transformations){
        const transformation = transformations[key]
        switch(transformation.type){
            case 'T':
                let parameters = transformation.translate;
                group.translateX(parameters[0]);
                group.translateY(parameters[1]);
                group.translateZ(parameters[2]);
                break;
            case 'R':
                let parameters1 = transformation.rotation;
                group.rotateX(degreesToRadians(parameters1[0]));
                group.rotateY(degreesToRadians(parameters1[1]));
                group.rotateZ(degreesToRadians(parameters1[2]));
                break;
            case 'S':
                let parameters2 = transformation.scale;
                group.scale.set(parameters2[0], parameters2[1], parameters2[2]);
                break;
        }
    }
}

const createRectangle = function (parameters, material, castShadow, receiveShadow){
    let width =  Math.abs(parameters.xy2[0] - parameters.xy1[0]);
    let height = Math.abs(parameters.xy2[1] - parameters.xy1[1]);
    let newMaterial = null;
    if(material != null && material != undefined){
        newMaterial = loadMaterials.createMaterial(material, width, height);
    }
    else{
        throw new Error("Error in function createRectangule. Lack of material");
    }

    let rectangleGeometry = new THREE.PlaneGeometry(width, height, parameters.parts_x, parameters.parts_y);
    let rectangleMesh = new THREE.Mesh(rectangleGeometry, newMaterial);
    rectangleMesh.position.x = (parameters.xy2[0] + parameters.xy1[0])/2.0;
    rectangleMesh.position.y = (parameters.xy2[1] + parameters.xy1[1])/2.0;

    rectangleMesh.castShadow = castShadow;
    rectangleMesh.receiveShadow = receiveShadow;

    return rectangleMesh;
}

const createBox = function (parameters, material, castShadow, receiveShadow){

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

    boxMesh.castShadow = castShadow;
    boxMesh.receiveShadow = receiveShadow;

    return boxMesh;
}

const createCylinder = function(parameters, material, castShadow, receiveShadow){

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

    cylinderMesh.castShadow = castShadow;
    cylinderMesh.receiveShadow = receiveShadow;

    return cylinderMesh;

}

const createSphere = function (parameters, material, castShadow, receiveShadow){

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

    sphereMesh.castShadow = castShadow;
    sphereMesh.receiveShadow = receiveShadow;

    return sphereMesh;
}

const createNurb = function(parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createNurb. Lack of material");  
    }

    let newMaterial = loadMaterials.createMaterial(material, 1, 1);

    let nurb = nurbsSurface.createNurbsSurfaces(parameters.controlpoints, 
                                                parameters.degree_u,
                                                parameters.degree_v,
                                                parameters.parts_u,
                                                parameters.parts_v,
                                                newMaterial)

    nurb.castShadow = castShadow;
    nurb.receiveShadow = receiveShadow;
    
    return nurb;

}

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

const buildPointLight = function(parameters){
    if (!parameters.enabled) return;

    let light = new THREE.PointLight(parameters.color, parameters.intensity, parameters.distance, parameters.decay);
    light.castShadow = parameters.castshadow;
    if (parameters.castshadow) {
        light.shadow.camera.far = parameters.shadowfar;
        light.shadow.mapSize.width = parameters.shadowmapsize;
        light.shadow.mapSize.height = parameters.shadowmapsize;
    }
    light.position.set(parameters.position[0], parameters.position[1], parameters.position[2]);
    return light;
}
const buildSpotLight = function(parameters){
    let light = new THREE.SpotLight(parameters.color, parameters.intensity, parameters.distance, parameters.angle, parameters.penumbra, parameters.decay);
    light.castShadow = parameters.castshadow;

    if (parameters.castshadow) {
        light.shadow.camera.far = parameters.shadowfar;
        light.shadow.mapSize.width = parameters.shadowmapsize;
        light.shadow.mapSize.height = parameters.shadowmapsize;
    }
    light.position.set(parameters.position[0], parameters.position[1], parameters.position[2]);
    
    const target = new THREE.Object3D();
    target.position.set(parameters.target[0], parameters.target[1], parameters.target[2]);
    light.target = target;
    
    return light;
}

const buildDirectionalLight = function(parameters){
    let light = new THREE.DirectionalLight(parameters.color, parameters.intensity);
    light.castShadow = parameters.castshadow;
    
    if (parameters.castshadow) {
        light.shadow.camera.left = parameters.shadowleft;
        light.shadow.camera.right = parameters.shadowright;
        light.shadow.camera.bottom = parameters.shadowbottom;
        light.shadow.camera.top = parameters.shadowtop;
    }
    if (parameters.castshadow) {
        light.shadow.camera.far = parameters.shadowfar;
        light.shadow.mapSize.width = parameters.shadowmapsize;
        light.shadow.mapSize.height = parameters.shadowmapsize;
    }
    light.position.set(parameters.position[0], parameters.position[1], parameters.position[2]);
    return light;
}