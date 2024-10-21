import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

export const nurbsSurface = {

    createNurbsSurfaces (positionX, positionY, positionZ, controlPoints, orderU, orderV, samplesU, samplesV, material) {
        this.builder = new MyNurbsBuilder();
    
        let surfaceData;
        let mesh;

        surfaceData = this.nurbsBuilder.build(controlPoints, orderU, orderV, samplesU, samplesV, this.material);
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.position.set(positionX, positionY, positionZ);

        return mesh;
    }
}