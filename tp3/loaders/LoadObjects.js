/**
 * @file LoadObjects.js
 * @desc Complete
 */

import * as THREE from 'three';
import { loadMaterials } from './LoadMaterials.js';
import {nurbsSurface} from '../utils/NurbsSurface.js'
import { MyTriangle } from '../utils/MyTriangle.js';
import { MyTrack } from '../objects/MyTrack.js';
import { MyObstacle } from '../objects/MyObstacle.js';
import { MyRoute } from '../objects/MyRoute.js';
import { MyPowerUp } from '../objects/MyPowerUp.js';

export const objects = [];
export const lights = [];
export const routes = {};
export const loadObjects = {

    /**
     * Loads a scene by processing nodes and applying materials to create a Three.js group of objects
     * @method 
     * @param {Object} data - The data containing the information about the nodes and objects to be loaded.
     * @param {Object} materials - The materials to be applied to the objects.  
     * @returns {THREE.Group} - A Three.js Group containing the loaded objects in the scene.
     */
    load: function(data, materials){
        const root = data
        if (root == null) return
        let scene = dealWithNodes(root, null, materials)
        return scene
    },

    /**
     * Retrieves the array of loaded objects.
     * @method 
     * @returns {Array} - An array of objects that have been loaded by the `load` method.
     */    
    getObjects: function(){
        return objects;
    },

    /**
     * Retrieves the array of loaded lights.
     * @method 
     * @returns {Array} - An array of lights that have been loaded by the `load` method.
     */   
    getLights: function(){
        return lights;
    },

    getRoutes: function(){
        return routes;
    }

}

/**
 * Recursively processes nodes and their children to create a Three.js group of objects.
 * @method 
 * @param {Object} node - The node object that defines the structure of the scene or object. It contains information about children, type, material, transformations, and other properties.
 * @param {string|null} materialId - The ID of the material to be applied to the node. Defaults to `null` if not specified.
 * @param {Object} materials - An object containing material definitions. It is used to apply specific materials to the nodes.
 * @returns {THREE.Group} - A Three.js group containing the objects created for the node and its children
 */ 
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
                let receiveShadow = node.receiveShadows;

                switch(child.type){
                    case 'pointlight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let pointLight = buildPointLight(child);
                        group.add(pointLight);
                        lights.push(pointLight);
                        break;
                    case 'spotlight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let spotLight = buildSpotLight(child);
                        group.add(spotLight);
                        lights.push(spotLight);
                        break;
                    
                    case 'directionallight':
                        if (node.castshadow) child.castshadow = true;
                        if (node.receiveshadow) child.receiveshadow = true;
                        let directionalLight = buildDirectionalLight(child);
                        group.add(directionalLight);
                        lights.push(directionalLight);
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
                            case 'triangle':
                                primitive = createTriangle(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'polygon':
                                primitive = createPolygon(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'track':
                                primitive = createTrack(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case 'obstacle':
                                primitive = createObstacle(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            case "route":
                                primitive = createRoute(child.representations[0], node.id, material, castShadow, receiveShadow);
                                break;
                            case 'powerup':
                                primitive = createPowerup(child.representations[0], material, castShadow, receiveShadow);
                                break;
                            default:
                                throw new Error('Invalid primitive type ' + child.subtype);
                        }
                        
                        group.add(primitive);
                        objects.push(primitive);
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

/**
 * Applies a series of transformations (translation, rotation, and scaling) to a Three.js group.
 * @method 
 * @param {THREE.Group} group - The Three.js group to which transformations will be applied.
 * @param {Object} transformations - An object containing an array of transformation objects.
 */ 
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

/**
 * Creates a rectangle mesh in 3D space with the specified dimensions, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the rectangle's properties.
 * @param {THREE.Material} material - The material to apply to the rectangle mesh.
 * @param {boolean} castShadow - Whether the rectangle should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the rectangle should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the rectangle with the specified properties.
 */ 
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

/**
 * Creates a box mesh in 3D space with the specified dimensions, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the box's properties.
 * @param {THREE.Material} material - The material to apply to the box mesh.
 * @param {boolean} castShadow - Whether the box should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the box should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the box with the specified properties.
 */ 
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

/**
 * Creates a cylinder mesh in 3D space with the specified dimensions, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the cylinder's properties.
 * @param {THREE.Material} material - The material to apply to the cylinder mesh.
 * @param {boolean} castShadow - Whether the cylinder should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the cylinder should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the cylinder with the specified properties.
 */
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

    let thetaLength = parameters.thetalength;
    if (thetaLength !== 2 * Math.PI) {
        thetaLength = THREE.MathUtils.degToRad(thetaLength);
    }

        let cylinderGeometry = new THREE.CylinderGeometry(
                                parameters.top, 
                                parameters.base, 
                                parameters.height, 
                                parameters.slices, 
                                parameters.stacks, 
                                !parameters.capsclose, 
                                THREE.MathUtils.degToRad(parameters.thetastart), 
                                thetaLength);

        let cylinderMesh = new THREE.Mesh(cylinderGeometry, materials);

        cylinderMesh.castShadow = castShadow ?? false;
        cylinderMesh.receiveShadow = receiveShadow ?? false;

        return cylinderMesh;

}

/**
 * Creates a sphere mesh in 3D space with the specified dimensions, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the sphere's properties.
 * @param {THREE.Material} material - The material to apply to the sphere mesh.
 * @param {boolean} castShadow - Whether the sphere should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the sphere should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the sphere with the specified properties.
 */
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
                        parameters.slices ?? 32, 
                        parameters.stacks ?? 16, 
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

/**
 * Creates a nurb surface mesh in 3D space with the specified dimensions, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the nurb's properties.
 * @param {THREE.Material} material - The material to apply to the nurb mesh.
 * @param {boolean} castShadow - Whether the nurb should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the nurb should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the nurb with the specified properties.
 */
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

const createTrack = function(parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createTrack. Lack of material");  
    }

    let newMaterial = loadMaterials.createMaterial(material, 1, 1);
    let track = new MyTrack(parameters, newMaterial, castShadow, receiveShadow)

    return track;
}

const createObstacle = function(parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createObstacle. Lack of material");  
    }

    let newMaterial = loadMaterials.createMaterial(material, 1, 1);
    let obstacle = new MyObstacle(parameters, newMaterial, castShadow, receiveShadow);

    return obstacle;
}
const createPowerup = function(parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createPowerup. Lack of material");  
    }

    let newMaterial = loadMaterials.createMaterial(material, 1, 1);
    let powerup = new MyPowerUp(parameters, newMaterial, castShadow, receiveShadow);

    return powerup;
}
const createRoute = function(parameters, routeID, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createRoute. Lack of material");  
    }

    let newMaterial = loadMaterials.createMaterial(material, 1, 1);
    let route = new MyRoute(parameters, newMaterial, castShadow, receiveShadow);
    routes[routeID] = route;

    return route;
}

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);


/**
 * Creates and returns a `THREE.PointLight` based on the provided parameters.
 * @method 
 * @param {Object} parameters - An object containing properties to configure the point light.
 * @returns {THREE.PointLight | undefined} - A `THREE.PointLight` object configured with the specified properties, or `undefined` if the light is disabled.
 */
const buildPointLight = function(parameters){
    if (!parameters.enabled) return;

    let color = new THREE.Color(parameters.color[0], parameters.color[1], parameters.color[2]);
    let light = new THREE.PointLight(color, parameters.intensity, parameters.distance, parameters.decay);
    light.castShadow = parameters.castshadow;
    if (parameters.castshadow) {
        light.shadow.camera.far = parameters.shadowfar;
        light.shadow.mapSize.width = parameters.shadowmapsize;
        light.shadow.mapSize.height = parameters.shadowmapsize;
    }
    light.position.set(parameters.position[0], parameters.position[1], parameters.position[2]);
    return light;
}

/**
 * Creates and returns a `THREE.SpotLight` based on the provided parameters.
 * @method 
 * @param {Object} parameters - An object containing properties to configure the spot light.
 * @returns {THREE.SpotLight} - A `THREE.SpotLight` object configured with the specified properties.
 */
const buildSpotLight = function(parameters){
    if (!parameters.enabled) return;
    let color = new THREE.Color(parameters.color[0], parameters.color[1], parameters.color[2]);
    let light = new THREE.SpotLight(color, parameters.intensity, parameters.distance, parameters.angle, parameters.penumbra, parameters.decay);
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

/**
 * Creates and returns a `THREE.DirectionalLight` based on the provided parameters.
 * @method 
 * @param {Object} parameters - An object containing properties to configure the directional light.
 * @returns {THREE.DirectionalLight} - A `THREE.DirectionalLight` object configured with the specified properties.
 */
const buildDirectionalLight = function(parameters){
    if (!parameters.enabled) return;
    let color = new THREE.Color(parameters.color[0], parameters.color[1], parameters.color[2]);
    let light = new THREE.DirectionalLight(color, parameters.intensity);
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

/**
 * Creates a triangle mesh in 3D space based on the specified parameters, material, and shadow properties.
 * @method 
 * @param {Object} parameters - An object containing the vertices of the triangle.
 * @param {THREE.Material} material - The material to apply to the triangle mesh.
 * @param {boolean} castShadow - Whether the triangle should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the triangle should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the triangle with the specified properties, including shadow properties.
 */
const createTriangle = function (parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createTriangle. Lack of material");  
    }
    
    let v1 = new THREE.Vector3(parameters.xyz1[0], parameters.xyz1[1], parameters.xyz1[2]);
    let v2 = new THREE.Vector3(parameters.xyz2[0], parameters.xyz2[1], parameters.xyz2[2]);
    let v3 = new THREE.Vector3(parameters.xyz3[0], parameters.xyz3[1], parameters.xyz3[2]);

    let a = v1.distanceTo(v2); // V1 - V2
    let b = v2.distanceTo(v3); // V2 - V3
    let c = v1.distanceTo(v3); // V1 - V3
    
    let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
    let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)

    let height = c * sin_ac;
    let base = a;

    let newMaterial = loadMaterials.createMaterial(material, base, height);
    let triangleGeometry = new MyTriangle(parameters.xyz1[0], parameters.xyz1[1], parameters.xyz1[2],
                                          parameters.xyz2[0], parameters.xyz2[1], parameters.xyz2[2],                   
                                          parameters.xyz3[0], parameters.xyz3[1], parameters.xyz3[2])

    let triangleMesh = new THREE.Mesh(triangleGeometry, newMaterial);

    triangleMesh.castShadow = castShadow ?? false;
    triangleMesh.receiveShadow = receiveShadow ?? false;

    return triangleMesh;

}

/**
 * Creates a polygonal mesh in 3D space based on the specified parameters, material, and shadow properties.
 * The function generates a polygonal shape with customizable slices and stacks, color gradients, and shadow configurations.
 * @method 
 * @param {Object} parameters - An object containing the properties of the polygon.
 * @param {THREE.Material} material - The material to apply to the polygon mesh.
 * @param {boolean} castShadow - Whether the polygon should cast shadows in the scene.
 * @param {boolean} receiveShadow - Whether the polygon should receive shadows in the scene.
 * @returns {THREE.Mesh} - A new `THREE.Mesh` object representing the polygon with the specified properties, including shadow settings.
 */
const createPolygon = function (parameters, material, castShadow, receiveShadow){
    if(material == null || material == undefined){
        throw new Error("Error in function createPolygon. Lack of material");  
    }
    const slices = parameters.slices;
    const stacks = parameters.stacks;

    const color_c = new THREE.Color(parameters.color_c[0], parameters.color_c[1], parameters.color_c[2]);
    const color_p = new THREE.Color(parameters.color_p[0], parameters.color_p[1], parameters.color_p[2]);

    const radius = parameters.radius;
    let step = radius / stacks  
    let vertices = [];
    let colors = [];
    let angle = 2 * Math.PI / slices;

    let geometry = new THREE.BufferGeometry();
    
    for (let s = 0; s <= stacks; s++){
        for (let i = 0; i < slices; i++){
            const points = [
                [Math.cos(i * angle) * (step * s), Math.sin(i * angle) * (step * s), 0],
                [Math.cos((i + 1) * angle) * (step * s), Math.sin((i + 1) * angle) * (step * s), 0],
                [Math.cos((i+1) * angle) * (step * (s + 1)), Math.sin((i+1) * angle) * (step * (s + 1)), 0],
                [Math.cos(i * angle) * (step * (s + 1)), Math.sin(i * angle) * (step * (s + 1)), 0]
            ];
            const colors_v = [
                new THREE.Color().lerpColors(color_c, color_p, s * step).toArray(),
                new THREE.Color().lerpColors(color_c, color_p, (s+1) * step).toArray(),
            ];
            vertices.push(...points[0], ...points[3], ...points[2]);
            colors.push(...colors_v[0], ...colors_v[1], ...colors_v[1]);
            if (s !== 0){
                vertices.push(...points[0], ...points[1], ...points[2]);
                colors.push(...colors_v[0], ...colors_v[0], ...colors_v[1]);
            }
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    
    const newMaterial = new THREE.MeshPhongMaterial({vertexColors: true, side: THREE.DoubleSide});
    let mesh = new THREE.Mesh(geometry, newMaterial);
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;  
}
