import { Etat } from "./etat.js"
import { Inactive } from "./inactive.js"
import { Stop } from "./stop.js"
export class Tik extends Etat{
    static nom="tik"
    static libelle="Sonde le terrain"
    static needsStop=true
    static canRepeat=false
    static stateBack=true

    actionName
    constructor(mae){
        super(mae,"tik", "Sonde le terrain")

    }

    init(){
        // this.o.currentAction && this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
        this.actionName=(Math.random()>.5?"tyk1":"tyk2")

        this.o.play(this.actionName)
        this.o.ratioDirtyTik+=this.o.stepDirtyTik
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