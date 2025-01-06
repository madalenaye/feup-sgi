import * as THREE from "three";
import {MySprite} from '../utils/MySprite.js'
import {MyButton} from './MyButton.js'

class MyGameOver extends THREE.Object3D{
    constructor(currentLayer){
        super();
        const textureLoader = new THREE.TextureLoader()
        const menuTexture = textureLoader.load('./scenes/textures/menu.jpg');
        const menuMaterial = new THREE.MeshStandardMaterial({ map: menuTexture, side: THREE.DoubleSide });
        this.geometry = new THREE.BoxGeometry( 50, 25, 2 );
        this.material = menuMaterial
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.layer = currentLayer;
        
        this.sprite = MySprite.loadSpritesheet(0x00174c);
        this.blueSprite = MySprite.loadSpritesheet(0x1255ca);

        this.name = MySprite.createTextFromSpritesheet("Final", 2.8, 2.8, this.sprite);
        this.name.position.set(-8, 9.5, 1.2)
        this.mesh.add(this.name);
        this.name1 = MySprite.createTextFromSpritesheet("Results", 2.5, 2.5, this.blueSprite);
        this.name1.position.set(-6, 7, 1.2)
        this.mesh.add(this.name1);

        this.playerBalloon = MySprite.createTextFromSpritesheet("Player Balloon:", 1, 1, this.sprite);
        this.playerBalloon.position.set(-18, 3, 1.2);
        this.mesh.add(this.playerBalloon);

        this.enemyBalloon = MySprite.createTextFromSpritesheet("Bot Balloon:", 1, 1, this.sprite);
        this.enemyBalloon.position.set(-15, 1, 1.2);
        this.mesh.add(this.enemyBalloon);

        this.winner = MySprite.createTextFromSpritesheet("Winner:", 1, 1, this.sprite);
        this.winner.position.set(-10, -1, 1.2);
        this.mesh.add(this.winner);

        this.loser = MySprite.createTextFromSpritesheet("Loser:", 1, 1, this.sprite);
        this.loser.position.set(-9, -3, 1.2);
        this.mesh.add(this.loser);

        this.winnerTime = MySprite.createTextFromSpritesheet("Winner Time:", 1, 1, this.sprite);
        this.winnerTime.position.set(-15, -5, 1.2);
        this.mesh.add(this.winnerTime);

        this.restart = new MyButton("Restart", this.blueSprite, 1, 1, 8, 3, "restart");
        this.restart.position.set(3, -8, 1.2);
        this.restart.layers.set(this.layer);
        this.mesh.add(this.restart);

        this.home = new MyButton("Home", this.blueSprite, 1, 1, 8, 1.4, "home");
        this.home.position.set(15, -8, 1.2);
        this.restart.layers.set(this.layer);
        this.mesh.add(this.home);

        this.add(this.mesh);

        this.objects = [];
        this.objects.push(this.restart, this.home);
    }

    updatePlayerBalloon(text){
        MySprite.updateSpritesheetText(this.playerBalloon, `Player Balloon: ${text}`, 1, 1, this.sprite);
    }
    updateBotBalloon(text){
        MySprite.updateSpritesheetText(this.enemyBalloon, `Bot balloon: ${text}`, 1, 1, this.sprite);
    }
    updateWinner(text){
        MySprite.updateSpritesheetText(this.winner, `Winner: ${text}`, 1, 1, this.sprite);
    }
    updateLoser(text){
        MySprite.updateSpritesheetText(this.loser, `Loser: ${text}`, 1, 1, this.sprite);
    }
    updateWinnerTime(text){
        MySprite.updateSpritesheetText(this.winnerTime, `Winner Time: ${text}`, 1, 1, this.sprite);
    }
}

export {MyGameOver};