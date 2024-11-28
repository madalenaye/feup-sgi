import * as THREE from 'three';

export const loadObjects = {

    loadObjects(rootNode, listObjects, organizeMaterials){

        function traverseDFS(node, parentId = null) {
            if (!node) return;

            if (parentId) {
                console.log(`Parent: ${parentId}`);
            }

            if (node.type === 'pointlight' || node.type === 'spotlight' || node.type === 'directionallight') {
                console.log(`Light with type: ${node.type}`);
                return;
            }

            if(node.type === 'primitive'){
                console.log(`Primitive with type: ${node.subtype}`)
                return;
            }

            if (node.id) {
                console.log(`ID: ${node.id}`);
            }

            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(childNode => {traverseDFS(childNode, node.id || null);});
            }
        }
        
        const rootObject = listObjects[rootNode];
        traverseDFS(rootObject);
    }
}