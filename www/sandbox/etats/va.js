import { AttrappeGraine } from "./attrape_graine.js"
import { Explore } from "./explore.js"
import { PoseGraine } from "./pose_graine.js"
import { Stop } from "./stop.js"

export class Va extends Explore{
    static nom="va"
    static libelle="Va à l'élément ciblé"
    static clearsProgram=true

    step=0
    i=0
    constructor(mae){
        super(mae, "explore", "Explore les environs")
        // this.o.target&&console.log("new VA ",this.o.target.getName())
    }

    targetUnavailable(){
        this.isTerminated
        this.o.target=null
        this.mae.schedule(Explore)
        this.mae.setToNextState()
    }

    tick(delta){
        switch (this.step) {
            case 0:
                if((this.o.target.transportedBy && this.o.target.transportedBy!==this.o)||this.o.target.checkPoint){
                    this.targetUnavailable()
                    return
                }
                if( Math.random() < this.o.ratioFollowingTarget ){
                    this.o.seek()
                }
                this.o.targetAttraction()
                super.tick(delta)
                if(this.o.isTargetReached()){
                    // console.log("va targetReached")
                    this.o.targetReached=this.o.target
                    if(this.o.target.isFood){
                        this.o.target.setTransportedBy(this.o)
                        this.o.play("mandible_open",false)
                        this.step=1
                    }
                    else if(this.o.target.isGranary){//arrive à fourmiliere
                            // this.o.setTarget(undefined)
                            this.isTerminated=true
                            if(this.o.charge){
                                this.mae.schedule(Stop,PoseGraine)
                            }
                            this.mae.setToNextState()
                    }
                }
                break;
            case 1://rotate  vers target
                // console.log("va.step 1 ")
                this.o.seek()
                this.o.steering.clampLength(0.002,0.002)
                this.o.applyForce(this.o.steering)
                this.o.steering.set(0,0,0)
                // this.o.targetAttraction()
                this.o.velocity.set(0.0005,this.o.velocity.y,0.0005)
                // this.o.applyForce(this.o.steering)
                this.o.update(delta)
                
                this.i+=delta
                if(this.i>.17){
                    this.o.target.onReached()
                    this.isTerminated=true
                    if(this.o.target.isFood){
                        this.mae.schedule(Stop,AttrappeGraine)
                        this.mae.setToNextState()
                    }
                    else{//cotinue la quete
                        this.step=0
                    }
                }

                break;
            case 2://rotate  vers target
                console.log("step 2 ",this.o.currentAction.nom)
                break
            default:
                break;
        }
    }

    
}