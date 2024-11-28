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

    loadObjects(rootNode, listObjects, organizeMaterials){

        let objects = {};

        function traverseDFS(node, parentGroup = null, organizeMaterials) {
            if (!node) return;

            const currentGroup = new THREE.Group();
            currentGroup.name = node.id;

            if (node.type === 'pointlight' || node.type === 'spotlight' || node.type === 'directionallight') {
                console.log(`Light with type: ${node.type}`);
                loadObjects.loadLight(node, currentGroup);
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
                currentGroup.name = "primitive";
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