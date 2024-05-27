import { Etat } from "./etat.js"
import { OpenMandibles } from "./ouvre_mandibules.js"
import { Rentre } from "./rentre.js"
import { Stop } from "./stop.js"
import { Va } from "./va.js"

export class AttrappeGraine extends Etat{
    static nom="attrape graine"
    static libelle="Attraper une graine"
    static needsStop=true
    static canRepeat=true

    constructor(mae){
        super(mae,"attrape graine", "Attraper une graine")
    }

    init(){
        // this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
        this.actionName="mandible_grab_seed"
        this.o.play(this.actionName,false)
    }
    getTarget(){
        console.log("ant target name",this.o.target.name)

    }
    onActionFinished(e){
        if(e.action._clip.name==="mandible_grab_seed"){
            if(this.isTerminated)
                return
            this.isTerminated=true
    
            // console.log("attrape action finishe",e);
            const granary=this.o.getGranary()
            if(granary){
                this.o.setCharge(this.o.targetReached)
                this.o.setTarget(granary)
                this.o.play("charged",false)
                this.mae.clearProgram()
                this.mae.schedule(Stop,Va)
            }
            else{
                //mange RAF
            }
        }
       

    }
    
}