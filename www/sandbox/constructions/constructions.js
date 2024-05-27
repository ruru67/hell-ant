import * as THREE from 'three';
import { Colony } from "../ants_colony.js"
import { Os } from "../os.js"
import { Granary } from "./granary.js"

export class Constructions extends Os{
    // /** @var {Colony} colony */
    colony
    constructor(game){
        super(game.scene)
        this.setGame(game)
    }
    /**
     * @param {Colony} colony 
     */
    setColony(colony){
        this.colony=colony
    }

    /**
     * Attach a new granary to parent at the given position x,y,z
     * @param {THREE.Object3D} parent 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @returns {Granary}
     */
    addGranary(parent,x,y,z){
        const granary=new Granary(parent)
        granary.setOs(this)
        granary.setPosition(x,y,z)
        granary.buildObj()
        granary.followSlope()
        this.t.push(granary)
        return granary
    }

    getGranary(){
        for (let o of this.t){
            if(o.constructor===Granary){
                return o
            }
        }
        console.warn("NO GRANARY FOUND!!")
        return null
    }
}