import { Etat } from "./etat.js"

export class OpenMandibles extends Etat{
    static nom="ouvre mandibules"
    static libelle="Ouvrir les mandibules"
    static needsStop=true
    static canRepeat=true

    // actionName="mandible_open"
    constructor(mae){
        super(mae,"ouvre mandibules", "Ouvrir les mandibules")
    }

    init(){
        // this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
        this.actionName="mandible_grab_seed"

        this.o.play(this.actionName,false)
        // this.mae.setToNextState()
        // if (previousAction) {
        //     // this.o.play(previousAction)
        //     // this.o.setState(previousConstructor)
        //     this.mae.etatSuivant=previousConstructor
            
        // }
        // else{
        //     // this.o.inputEtat.setValue("inactive")
        //     this.mae.etatSuivant=Inactive   
        //     // this.o.setState(Inactive)
        // }
    }

    
}