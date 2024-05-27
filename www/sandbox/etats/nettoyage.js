import { Etat } from "./etat.js"
import { Inactive } from "./inactive.js"
export class Nettoyage extends Etat{
    static nom="toilettage"
    static libelle="Nettoyage d'antennes"
    static needsStop=true
    static canRepeat=false
    static stateBack=true
    
    constructor(mae){
        super(mae,"toilettage", "Nettoie ses antennes")
    }

    init(){
        // console.log("init nettoyage");
        // let previousAction, previousConstructor
        // if(this.o.currentAction){
        //     previousAction=this.o.currentAction._clip.name
        //     previousConstructor=this.mae.etatEnCours.constructor
        //     this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
        // }
        
        this.o.play("clean")
        this.o.ratioDirtyTik=0
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

    // tick(delta){
    //     super.tick(delta)
    //     this.o.acceleration.multiplyScalar(Math.pow(1-this.o.ratioDecceleration,4))

    //     this.o.velocity.multiplyScalar(Math.pow((1-this.o.ratioDecceleration),4))
    //     this.o.update()

    // }
}