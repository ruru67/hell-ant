import { Etat } from "./etat.js"
import { Marche } from "./marche.js";
import { Nettoyage } from "./nettoyage.js";
import { Stop } from "./stop.js";
import { Tik } from "./tik.js";
// import { Va } from "./va.js";
export class Explore extends Marche{
    static nom="explore"
    static libelle="Explore les environs"
    static needsStop=true
    static clearsProgram=true

    // isTerminated=true
    constructor(mae){
        super(mae, "explore", "Explore les environs")
    }

    
    randomTik(){
        if(Math.random()<this.o.ratioTik){
            this.o.currentAction.isRunning && this.o.currentAction.fadeOut(.3)
            if(this.o.ratioDirtyTik<1)
                this.mae.schedule(Tik)
            else
                this.mae.schedule(Nettoyage)
            // this.mae.schedule(this.constructor)
            this.mae.setToNextState()
        }
    }

    tick(delta){
        if(this.constructor===Explore){
            if(!this.o.charge && this.lookFor()){
                this.o.update(delta)
                return
            }
        }
        !this.o.charge  && this.randomTik()
        if(Math.random()<this.o.ratioRandomDirection){
            this.randomDirection()
        }
        if(Math.random()<this.o.ratioRandomAcceleration){
            this.randomAcceleration()
        }
        this.o.applyForce(this.o.steeringSeparation)
        this.o.steeringSeparation.set(0,0,0)

        
        this.o.update(delta)
    }

    lookFor(){
        const game=this.mae.getGame()
        if(game.foods){
            let distMini=Infinity
            let found
            for(let food of game.foods.getAll()){
                if(!food.checkPoint && !food.transportedBy){
                    const dist=food.getPosition().distanceTo(this.o.getPosition())
                    if(dist<distMini && dist<=this.o.view_radius){
                        found=food
                        distMini=dist
                    }
                }
            }
            if(found){
                this.o.target=found
                this.isTerminated=true
                this.mae.scheduleByString("va")
                this.mae.setToNextState()
                return true
            }
        }
        return false
    }

    onActionFinished(e){
        // if(!this.step)
        //     this.isTerminated=true
    }
}