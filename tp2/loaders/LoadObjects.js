import * as THREE from 'three';

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

    loadObjects(rootNode, listObjects, organizeMaterials){

        let objects = {};

        function traverseDFS(node, parentGroup = null, organizeMaterials) {
            if (!node) return;

            const currentGroup = new THREE.Group();

            if (node.type === 'pointlight' || node.type === 'spotlight' || node.type === 'directionallight') {
                console.log(`Light with type: ${node.type}`);
                //Criar a luz
                //return;
            }
            else if (node.id) {
                console.log(`ID: ${node.id}`);
                loadObjects.loadNode(node, currentGroup);
            }

            if (parentGroup) {
                parentGroup.add(currentGroup);
            }

            if(node.type === 'primitive'){
                console.log(`Primitive with type: ${node.subtype}`)
                // Criar primitiva
                //return;
            }

            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(childNode => {traverseDFS(childNode, currentGroup || null);});
            }
        }
        
        const rootObject = listObjects[rootNode];
        traverseDFS(rootObject, null, organizeMaterials);
    }
}