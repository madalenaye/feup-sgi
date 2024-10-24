import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

export const nurbsSurface = {

    createNurbsSurfaces (positionX, positionY, positionZ, controlPoints, orderU, orderV, samplesU, samplesV, material) {
        this.builder = new MyNurbsBuilder();
    
        let surfaceData;
        let mesh;

        surfaceData = this.builder.build(controlPoints, orderU, orderV, samplesU, samplesV, material);
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.position.set(positionX, positionY, positionZ);

        return mesh;
    }
}