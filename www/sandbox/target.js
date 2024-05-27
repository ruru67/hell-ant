import * as THREE from 'three';
import { O } from './o.js';

const material = {
    target: new THREE.MeshPhongMaterial( { //MeshBasicMaterial
        color: 0xf00f0f,
        shininess:60
    } ),
    targetReached: new THREE.MeshPhongMaterial( {
        color: 0x0ff00f,
        shininess:60
    } )
}
export class Target extends O{
    static specie="Target"
    position
    constructor(scene, rayon=0.028, position=new THREE.Vector3(),segments=48){
        super(scene)
        this.position=position
        this.rayon=rayon
        this.segments=segments
        this.buildDefaultObj()
    }
    getPosition(){
        return this.position
    }
    buildDefaultObj(){
        const geometry = new THREE.CircleGeometry( this.rayon, this.segments ); 
        this.obj=new THREE.Mesh( 
            geometry, 
            material.target 
        )
        this.obj.receiveShadow=true
        this.obj.rotation.x-=Math.PI/2
        this.obj.position.set(this.position.x,this.position.y,this.position.z);
        this.scene.add(this.obj)
    }

    setOnReached(f){
        this.onReached=f
    }

    

    setPositionRandom(rayon){
        this.position.set(
            Math.pow(Math.random(),2)*(Math.random()>.5?1:-1)*rayon,
            0,
            Math.pow(Math.random(),2)*(Math.random()>.5?1:-1)*rayon)
        this.obj.position.set(this.position.x,0.001,this.position.z);
    }
}

export class TargetAnt0 extends Target{
    defaultGeometry = new THREE.CircleGeometry( this.rayon, this.segments ); 

    defaultObj=new THREE.Mesh( 
        geometry, 
        material.target
    )
    onReached(){
        this.obj.material=material.targetReached
        this.obj.position.y=0.00001
        // this.targetMesh.geometry=new THREE.CircleGeometry( this.rayon, this.segments )
        super.onReached()
    }
}