/**
 * @file LoadMaterials.js
 * @desc Module for organizing material properties and creating materials in a THREE.js environment.
 * It supports texture loading, bump maps, specular maps, and mipmap management for custom materials.
 */

import * as THREE from 'three';
import { loadTextures } from './LoadTextures.js';

export const loadMaterials = {

    /**
     * Organizes the material properties by converting them into THREE.js material-compatible formats.
     * @method
     * @param {Object} textures - Object containing loaded textures where the key is the texture reference.
     * @param {Object} materials -  Object containing the material definitions with texture references and other properties.
     * @returns {Object} - An object where each key corresponds to a material with organized properties, including textures and mipmaps.
     */
    organizeProperties(textures, materials){
        let organizeMaterials = {};

        Object.keys(materials).forEach(key => {
            let material = materials[key];
            let newMaterial = {
                color: new THREE.Color(material.color[0], material.color[1], material.color[2]),
                specular: new THREE.Color (material.specular[0], material.specular[1], material.specular[2]),
                shininess: material.shininess,
                emissive: new THREE.Color (material.emissive[0], material.emissive[1], material.emissive[2]),
                transparent: material.transparent,
                opacity: material.opacity,
                wireframe: material.wireframe,
                flatShading: material.shading === "flat", 
                side: material.twosided === false ? THREE.FrontSide : THREE.DoubleSide,
                bumpScale: material.bumpscale,
                texlength_s: material.texlength_s,
                texlength_t: material.texlength_t,
                loadTexture: null,
                loadBump: null,
                loadSpecular: null,
                hasMipMap:false,
                mipmaps: null
            };

            if(material.textureref != null){
                let loadedTexture = textures[material.textureref];
                newMaterial.loadTexture = loadedTexture.clone();
            }

            if(material.bumpref != null){
                let loadedBump = textures[material.bumpref];
                newMaterial.loadBump = loadedBump.clone();
            }

            if(material.specularref != null){
                newMaterial.loadSpecular = textures[material.specularref].clone();
            }
            
            if(textures[material.textureref]?.mipmaps?.[0]){
                newMaterial.hasMipMap = true;
                newMaterial.mipmaps = textures[material.textureref].mipmaps;
            }

            organizeMaterials[key] = newMaterial;
            
        });
        return organizeMaterials;
    },

    /**
     * Creates a THREE.js material using the properties organized in `organizeProperties`.
     * @method
     * @param {Object} organizeMaterial - An object containing the properties for the material
     * @param {Number} widthTex - The width of the texture used to calculate repeat settings
     * @param {Number} heightTex - The height of the texture used to calculate repeat settings.
     * @returns {THREE.Material} - The created THREE.js material.
     */
    createMaterial(organizeMaterial, widthTex, heightTex){
        
        let newMaterial = new THREE.MeshPhongMaterial({
            map: organizeMaterial.loadTexture,
            color: organizeMaterial.color,
            specular: organizeMaterial.specular,
            shininess: organizeMaterial.shininess,
            emissive: organizeMaterial.emissive,
            transparent: organizeMaterial.transparent,
            opacity: organizeMaterial.opacity,
            wireframe: organizeMaterial.wireframe,
            flatShading: organizeMaterial.flatShading,
            side: organizeMaterial.side,
            bumpScale: organizeMaterial.bumpScale,
            bumpMap : organizeMaterial.loadBump,
            specularMap : organizeMaterial.loadSpecular
        });

        if(organizeMaterial.loadTexture != null){
            newMaterial.map.wrapS = THREE.RepeatWrapping;
            newMaterial.map.wrapT = THREE.RepeatWrapping;

            let repeatX = 1;
            let repeatY = 1;
            if (organizeMaterial.texlength_s != 1){
                repeatX = widthTex / organizeMaterial.texlength_s;
            }
            
            if (organizeMaterial.texlength_t != 1){
                repeatY = heightTex / organizeMaterial.texlength_t;
            }

            newMaterial.map.repeat.set(repeatX, repeatY);
            newMaterial.map.needsUpdate = true;

            if(organizeMaterial.hasMipMap == true){
                for (let i = 0; i <= organizeMaterial.mipmaps.length -1 ; i++) {
                    loadTextures.loadMipmap(newMaterial.map, i, organizeMaterial.mipmaps[i]);
                }
            }
        }

        if(organizeMaterial.loadBump != null){
            newMaterial.bumpMap.wrapS = THREE.RepeatWrapping;
            newMaterial.bumpMap.wrapT = THREE.RepeatWrapping;

            let repeatX = 1;
            let repeatY = 1;
            if (organizeMaterial.texlength_s != 1){
                repeatX = widthTex / organizeMaterial.texlength_s;
            }
            
            if (organizeMaterial.texlength_t != 1){
                repeatY = heightTex / organizeMaterial.texlength_t;
            }
            
            newMaterial.bumpMap.repeat.set(repeatX, repeatY);
            newMaterial.bumpMap.needsUpdate = true;
        }

        if(organizeMaterial.loadSpecular != null){
            newMaterial.specularMap.wrapS = THREE.RepeatWrapping;
            newMaterial.specularMap.wrapT = THREE.RepeatWrapping;

            let repeatX = 1;
            let repeatY = 1;
            if (organizeMaterial.texlength_s != 1){
                repeatX = widthTex / organizeMaterial.texlength_s;
            }
            
            if (organizeMaterial.texlength_t != 1){
                repeatY = heightTex / organizeMaterial.texlength_t;
            }
            newMaterial.specularMap.repeat.set(repeatX, repeatY);
            newMaterial.specularMap.needsUpdate = true;
        }
        return newMaterial;

    }
   
}
