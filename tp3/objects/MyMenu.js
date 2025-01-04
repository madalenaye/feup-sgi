import * as THREE from "three";
import {MySprite} from '../utils/MySprite.js'

class MyMenu extends THREE.Object3D{
    constructor(material){
        super();
        this.geometry = new THREE.BoxGeometry( 50, 25, 2 );
        this.material = material
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        
        this.sprite = MySprite.loadSpritesheet(0x00174c);
        this.blueSprite = MySprite.loadSpritesheet(0x1255ca);
        this.startButton = MySprite.createTextFromSpritesheet("start", 1.5, 1.5, this.sprite);
        this.startButton.position.set(-3.45, -10, 1.2);
        this.mesh.add(this.startButton);

        this.author1 = MySprite.createTextFromSpritesheet("Madalena Ye - 202108795 | Manuel Serrano - 202402793", 0.5, 0.8, this.blueSprite);
        this.author1.position.set(-13, 2.6, 1.2);
        this.mesh.add(this.author1);
        
        this.logo = new THREE.Mesh(
            new THREE.PlaneGeometry( 20, 20, 2 ), 
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("scenes/textures/feup-logo.png"), transparent: true })
        );
        this.mesh.add(this.logo);
        this.logo.position.set(0, 4.5, 1.2);
        this.logo.scale.set(0.45, 0.1, 0.3);

        this.name = MySprite.createTextFromSpritesheet("Rising", 2.8, 2.8, this.sprite);
        this.name.position.set(-8, 9.5, 1.2)
        this.mesh.add(this.name);
        this.name1 = MySprite.createTextFromSpritesheet("Rivals", 2.5, 2.5, this.blueSprite);
        this.name1.position.set(-6, 7, 1.2)
        this.mesh.add(this.name1);

        this.playerName = MySprite.createTextFromSpritesheet("Player Name: ", 1, 1, this.sprite);
        this.playerName.position.set(-18, 1, 1.2);
        this.mesh.add(this.playerName);

        this.changeName = MySprite.createTextFromSpritesheet("Change", 1, 1, this.sprite);
        this.changeName.position.set(10, 1, 1.2);
        this.mesh.add(this.changeName);

        this.level = MySprite.createTextFromSpritesheet("Level: ", 1, 1, this.sprite);
        this.level.position.set(-12, -1, 1.2);
        this.mesh.add(this.level);

        this.levelDown = MySprite.createTextFromSpritesheet("-", 1, 1, this.sprite);
        this.levelDown.position.set(10, -1, 1.2);
        this.mesh.add(this.levelDown);

        this.levelUp = MySprite.createTextFromSpritesheet("+", 1, 1, this.sprite);
        this.levelUp.position.set(12, -1, 1.2);
        this.mesh.add(this.levelUp);

        this.userBalloon = MySprite.createTextFromSpritesheet("User Balloon: ", 1, 1, this.sprite);
        this.userBalloon.position.set(-19, -3, 1.2);
        this.mesh.add(this.userBalloon);

        this.pickBalloon = MySprite.createTextFromSpritesheet("Pick", 1, 1, this.sprite);
        this.pickBalloon.position.set(10, -3, 1.2);
        this.mesh.add(this.pickBalloon);

        this.botBalloon = MySprite.createTextFromSpritesheet("Bot balloon: ", 1, 1, this.sprite);
        this.botBalloon.position.set(-18, -5, 1.2);
        this.mesh.add(this.botBalloon);

        this.pickBotBalloon = MySprite.createTextFromSpritesheet("Pick", 1, 1, this.sprite);
        this.pickBotBalloon.position.set(10, -5, 1.2);
        this.mesh.add(this.pickBotBalloon);

        this.pickTrack = MySprite.createTextFromSpritesheet("Track:", 1, 1, this.sprite);
        this.pickTrack.position.set(-12, -7, 1.2);
        this.mesh.add(this.pickTrack);

        this.track = MySprite.createTextFromSpritesheet("Change", 1, 1, this.sprite);
        this.track.position.set(10, -7, 1.2);
        this.mesh.add(this.track);


        this.add(this.mesh);

    }
}

export {MyMenu};