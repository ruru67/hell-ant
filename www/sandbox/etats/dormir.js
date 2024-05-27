import { Etat } from "./etat.js"
import { Inactive } from "./inactive.js"
import * as THREE from 'three';

export class Dormir extends Etat{
    static nom="dormir"
    static libelle="Faire la sieste"
    static needsStop=true
    static canRepeat=true
    static clearsProgram=true

    
    constructor(mae){
        super(mae,"dormir", "Faire la sieste")
    }

    init(){
        this.o.play("sleep")
    }

    beforeStateChange(){
        if(this.step===0){
            // console.log("before state change",this.o.currentAction)
            console.log("001");
            this.o.currentAction.pause=false
            this.o.currentAction.fadeOut(.3)
            this.o.play("unsleep")
            this.step++
        }
        else{
            // console.log("002");
            // this.isTerminated=true
            // this.o.currentAction.fadeOut(.3)
        }
    }

    onActionFinished(){
        if(this.step===1){
            this.isTerminated=true
            this.o.currentAction.fadeOut(.3)
        }
    }
    
}