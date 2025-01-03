import * as THREE from 'three';

class MyOutdoor2 extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        console.log("Os parametros são estes");
        console.log(parameters);
        
        // this.groupOutdoor.castShadow = castShadow ?? false;
        // this.groupOutdoor.receiveShadow = receiveShadow ?? false;

    }


}
export { MyOutdoor2 };