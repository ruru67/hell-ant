import { Etat } from "./etat.js"
import { Explore } from "./explore.js"
import { Inactive } from "./inactive.js"
import { OpenMandibles } from "./ouvre_mandibules.js"
import { Stop } from "./stop.js"
import { Va } from "./va.js"

export class PoseGraine extends Etat{
    static nom="pose graine"
    static libelle="Poser une graine"
    static needsStop=true
    static canRepeat=true
    static isFakeState=true

    constructor(mae){
        super(mae,"pose graine", "Poser une graine")
    }

    init(){
        // this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
        // this.actionName="lay_down"
        this.o.play("lay_down")
        this.o.fadeOut("charged",false,.01)
        this.o.fadeOut("mandible_grab_seed",false,.01)
        this.o.fadeOut("mandible_open",false,.01)
    }
    
    // tick(){
    // }

    onActionFinished(e){
        // console.log("pose-graine action finish",e.action._clip.name);
        if(e.action._clip.name==="lay_down"){
            if(this.isTerminated)
                return
            this.o.uncharge()
            this.o.setTarget(undefined)
            this.isTerminated=true
            
            this.mae.schedule(Stop)//,Explore)
            this.mae.setToNextState()
            
        }
        
    }
    
}

