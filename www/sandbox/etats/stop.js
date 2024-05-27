import { Etat } from "./etat.js"
export class Stop extends Etat{
    static nom="stop"
    static libelle="Stopper"
    static isFakeState=true
    
    constructor(mae){
        super(mae, "stop", "Stopper")
        
        // super.setConstructor(this.constructor)
    }

    init(){
        // console.log("init inactive");
        this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
    }

    tick(delta){
        // this.o.velocity.multiplyScalar((1-this.o.ratioDecceleration)/2)
        if(this.o.acceleration.length()>0.01){
            this.o.acceleration.multiplyScalar(Math.pow(1-this.o.ratioDecceleration,4))

            this.o.velocity.multiplyScalar(Math.pow((1-this.o.ratioDecceleration),4))
            this.o.update(delta)
        }
        else{
            this.o.acceleration.set(0,0,0)
            this.o.update(delta)
            this.isTerminated=true
            this.mae.setToNextState()
        }

    }
}