import { Inactive } from "./inactive.js"
import { Marche } from "./marche.js"
import { Stop } from "./stop.js"

export class Rentre extends Marche{
    static nom="rentre"
    static libelle="Va à la fourmilière"
    static clearsProgram=true
    step=0
    constructor(mae){
        super(mae, "rentre", "Va à la fourmilière")
        this.o.setTarget(this.o.getBase())
        
    }
    tick(delta){
        // this.randomTik()
        switch (this.step) {
            case 0:
                if( Math.random() < this.o.ratioFollowingTarget ){
                    this.o.seek()
                }
                // if(Math.random()<this.o.ratioRandomDirection){
                //     this.randomDirection()
                // }
                // if(Math.random()<this.o.ratioRandomAcceleration){
                //     this.randomAcceleration()
                // }
                this.o.targetAttraction()
                if(Math.random()<this.o.ratioRandomDirection){
                    this.randomDirection()
                }
                if(Math.random()<this.o.ratioRandomAcceleration){
                    this.randomAcceleration()
                }
                this.o.applyForce(this.o.steeringSeparation)
                this.o.steeringSeparation.set(0,0,0)
        
                this.o.update(delta)
                // this.o.update(delta)
                if(this.o.isTargetReached()){
                    this.step=1
                }
                break;
            case 1://rotate  vers target
                console.log("step 1 ",this.o.currentAction)
                
                    this.mae.schedule(Stop,Inactive)
                    this.mae.setToNextState()
                break;
            case 2://rotate  vers target
                console.log("step 2 ",this.o.currentAction.nom)
                break
            default:
                break;
        }
    }
}