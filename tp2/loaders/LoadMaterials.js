import * as THREE from 'three';
import { loadTextures } from './LoadTextures.js';

export const loadMaterials = {

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
                hasMipMap:false
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

            if(textures[material.textureref]?.mipmap?.[0]){
                newMaterial.hasMipMap = true;
            }

            organizeMaterials[key] = newMaterial;
            
        });
        return organizeMaterials;
    },

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
            let repeatX = widthTex / organizeMaterial.texlength_s;
            if (!repeatX) {
                repeatX = 1;
            }

            let repeatY = heightTex / organizeMaterial.texlength_t;
            if (!repeatY) {
                repeatY = 1;
            }
            newMaterial.map.repeat.set(repeatX, repeatY);
            newMaterial.map.needsUpdate = true;

            if(organizeMaterial.hasMipMap == true){
                for (let i = 0; i <= 7; i++) {
                    loadTextures.loadMipmap(newMaterial.map, i, newMaterial.mipmaps[i]);
                }
            }
        }

        if(organizeMaterial.loadBump != null){
            newMaterial.bumpMap.wrapS = THREE.RepeatWrapping;
            newMaterial.bumpMap.wrapT = THREE.RepeatWrapping;

            let repeatX = widthTex / organizeMaterial.texlength_s;
            if (!repeatX) {
                repeatX = 1;
            }
    
            let repeatY = heightTex / organizeMaterial.texlength_t;
            if (!repeatY) {
                repeatY = 1;
            }
            
            newMaterial.bumpMap.repeat.set(repeatX, repeatY);
            newMaterial.bumpMap.needsUpdate = true;
        }

        if(organizeMaterial.loadSpecular != null){
            newMaterial.specularMap.wrapS = THREE.RepeatWrapping;
            newMaterial.specularMap.wrapT = THREE.RepeatWrapping;

            let repeatX = widthTex / organizeMaterial.texlength_s;
            if (!repeatX) {
                repeatX = 1;
            }
    
            let repeatY = heightTex / organizeMaterial.texlength_t;
            if (!repeatY) {
                repeatY = 1;
            }
            newMaterial.specularMap.repeat.set(repeatX, repeatY);
            newMaterial.specularMap.needsUpdate = true;
        }
        return newMaterial;

    }
   
}
