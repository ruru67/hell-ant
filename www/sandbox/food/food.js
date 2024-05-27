import { O } from "../o.js";
import * as THREE from 'three';

const debug=true
export class Food extends O{
    static layDownOffSetY=0

    isFood=true
    transportedBy
    checkPoint
    constructor(scene,os){
        super(scene,os);

    }
    getLayDownOffSetY(){
        return this.constructor.layDownOffSetY
    }
    getPosition(){
        return this.position
    }
    onReached(Oreaching){
        // console.log(this.name+ " atteint");
    }

    /**
     * @param {O|undefined|null} o 
     */
    setTransportedBy(o){
        this.transportedBy=o
    }
}