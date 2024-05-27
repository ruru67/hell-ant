import * as THREE from 'three';
import { CheckPoint } from '../checkpoint.js';
import { Food } from '../food/food.js';


export class Granary extends CheckPoint{
    static num=0

    color=0x10a010//e02020
    isGranary=true
    fourmilliere
    constructor(parent){
        super(parent)
        console.warn("new Granary",this,this.getPosition())
        this.name="Grenier"+Granary.num
        parent.attach(this.obj)
        Granary.num++
    }
     
    getPosition(){
        return this.position
    }

    /**
     * @param {Food} food 
     * @param {THREE.Vector3} position 
     */
    addFood(food,position){
        console.log("granary.addFood",food)
    }

    onReached(Oreaching){
        // console.log(this.name+" atteinte");
    }
}