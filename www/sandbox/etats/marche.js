import { Etat } from "./etat.js";
import { Stop } from "./stop.js";

export class Marche extends Etat{
    init(){
        this.o.play("walk")
        super.init()
    }
    
    randomDirection(){
        this.o.acceleration.x+=(Math.random()-.5)*this.o.ratioDirection
        this.o.acceleration.z+=(Math.random()-.5)*this.o.ratioDirection
    }
    
    randomAcceleration(){
        let acc=Math.random()>.5?1+this.o.ratioAcceleration:1-this.o.ratioAcceleration;
        this.o.acceleration.multiplyScalar(acc).clampLength(this.o.minSpeed/5,this.o.maxSpeed/20)
    }

    beforeStateChange(){
        this.isTerminated=true
        this.mae.schedule(Stop)
        this.mae.setToNextState()
    }
}