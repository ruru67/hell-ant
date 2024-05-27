import * as THREE from 'three';
import { CheckPoint } from '../checkpoint.js';

const debug=false

export class Fourmiliere extends CheckPoint{
    static num=0

    isFourmiliere=true
    constructor(scene){
        super(scene)
        debug&&console.log("new Fourmiliere",this,this.getPosition())
        this.name="Fourmiliere"+Fourmiliere.num
        scene.add(this.obj)
        Fourmiliere.num++
    }
     
    getPosition(){
        return this.position
    }
    onReached(Oreaching){
        // console.log(this.name+" atteinte");
    }
}