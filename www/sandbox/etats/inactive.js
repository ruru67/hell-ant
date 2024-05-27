import { Etat } from "./etat.js"
export class Inactive extends Etat{
    static nom="inactive"
    static libelle="Pense"
    static needsStop=true
    static clearsProgram=true

    isTerminated=true
    constructor(mae){
        super(mae, "inactive", "Pense")
        this.mae.clearProgram()
    }

    

    // tick(delta){
    //     // this.o.velocity.multiplyScalar((1-this.o.ratioDecceleration)/2)
    //     this.o.acceleration.multiplyScalar(Math.pow(1-this.o.ratioDecceleration,4))

    //     this.o.velocity.multiplyScalar(Math.pow((1-this.o.ratioDecceleration),4))
    //     this.o.update(delta)

    // }
    onActionFinished(){
        
    }
}