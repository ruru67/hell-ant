import { Etat } from "./etat.js"
export class Pondre extends Etat{
    static nom="Pondre"
    static libelle="Pond"
    constructor(mae){
        super(mae, "pondre", "Pondre")
        super.setConstructor(this.constructor)
    }

    init(){
        // console.log("init inactive");
        this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
    }

    tick(delta){
        // this.o.velocity.multiplyScalar((1-this.o.ratioDecceleration)/2)
        this.o.acceleration.multiplyScalar(Math.pow(1-this.o.ratioDecceleration,4))

        this.o.velocity.multiplyScalar(Math.pow((1-this.o.ratioDecceleration),4))
        this.o.update()

    }
}