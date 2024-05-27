import * as THREE from 'three';
import { O } from './o.js';
import { Food } from './food/food.js';
import { GeometryMaker } from './geometryMaker.js';

export class CheckPoint extends O{
    color=0x101010//e02020
    obj=new THREE.Object3D()
    position=new THREE.Vector3()
    rayon=0
    
    yOffset=0.00005
    constructor(scene){
        super(scene)
        // this.buildObj()
    }

    /**
     * @param {Food} food 
     * @param {THREE.Vector3} position 
     */
    addFood(food,position){

    }

    setPosition(x,y,z){
        this.obj.position.set(x,y+this.yOffset,z)
        this.position.set(x,y,z)
    }

    /**
     * 
     * @returns THREE.Object3D
     */
    buildObj(){
        const r=.095,material = new THREE.MeshBasicMaterial( { color: this.color} );
        GeometryMaker.cross(this.obj, r, material)
        
        // this.obj.rotation.x-=Math.PI/2
        this.obj.position.set(this.position.x,this.position.y+this.yOffset,this.position.z);
        console.log("new Checkpoint",this.obj)
        return this.obj
    }
}