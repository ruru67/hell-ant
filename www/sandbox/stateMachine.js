import { Etat } from "./etats/etat.js"
import { Explore } from "./etats/explore.js"
import { Inactive } from "./etats/inactive.js"
import { Stop } from "./etats/stop.js"
import { Va } from "./etats/va.js"

const debug=false

export class StateMachine{
    o
    specieClass
    etats_possibles=[]
    
    etatEnCours
    etatSuivant=null
    program=[]
    previousState
    constructor(specieClass, o){
        this.specieClass=specieClass
        this.etats_possibles=specieClass.etats_possibles
        this.o=o
        debug&&console.log("New stateMachine for ",o)
    }

    /**
     * 
     * @param {Etat} etat 
     */
    userSetState(etat){
        // console.log("__________mae.setState____",etat.nom)
        if(this.etatEnCours && this.etatEnCours.constructor===etat && !this.etatEnCours.constructor.canRepeat)
            return

        if(etat.clearsProgram){
            this.clearProgram()
        }
            
        // console.log("b")

        // const etatEnCours=this.etatEnCours ? this.etatEnCours.constructor.getName():"0"
        // console.log("mae.setState from ", etatEnCours +" to "+etat.name)
        if(this.etatEnCours && this.etatEnCours.beforeStateChange ){
            this.etatEnCours.beforeStateChange()
            debug&&console.log("c")

        }
        
        if(!this.etatEnCours || this.etatEnCours.isTerminated){
            debug&&console.log("d")

            // if(etat.needsStop ){
            //     if(this.etatEnCours && this.etatEnCours.constructor!==Inactive ){
            //         // console.log("this.etatEnCours schedule Stop",this.etatEnCours);
            //         this.schedule(Stop)

            //     }
            // }
            this.schedule(etat)
            this.setToNextState()
        }
        else
        if(!this.etatEnCours.isTerminated && (this.program.length===0||this.program[0]!==etat)){
            debug&&console.log("e",etat.nom)
            this.schedule(etat)
            // this.setToNextState()
            // this.program.unshift(etat)
        }
    }

    getGame(){
        return this.o.getGame()
    }
    getState(){
        return this.etatEnCours
    }
    /**
     * 
     * @param {Etat} etat 
     */
    schedule(...etats){
        for(let etat in etats){
            // console.log("mae.schedule "+etats[etat].nom);

            // console.warn("schedule ",etat,etats)
            this.program.push(etats[etat])
            if(etats[etat].stateBack){
                for(let i=this.program.length-2;i>=0;i--){
                    if(!this.program[i].constructor.stateBack){
                        this.program.push(this.program[i])
                        break;
                    }
                }
            }

        }
        debug&&this.logProg()
    }
    scheduleByString(str){
        if(str==="va")
            this.schedule(Va)
    }

    setEtatEnCours(etat){
        debug&&console.log("set etat en cours : "+etat.nom)
        if(this.etatEnCours){
            if(!this.etatEnCours.constructor.isFakeState)
                this.previousState=this.etatEnCours.constructor;

        }
        this.etatEnCours=new etat(this)
    }
    setToNextState(){
        if(this.program.length>0){
            // console.log("mae.setToNextState prog");
            let etat=this.program.shift()
            // this.logProg()
            if(etat===Va && !this.o.target)
                etat=Explore
            this.setEtatEnCours(etat)
        }
        else if(this.previousState){
            if( this.previousState!==this.etatEnCours.constructor){
                debug&&console.log("mae.setToPrevious : "+this.previousState.name);
                if( this.previousState===Va && !this.o.target){
                    this.setEtatEnCours(Explore)
                }
                else
                    this.setEtatEnCours(this.previousState)
            }
        }
        else
            this.setEtatEnCours(Inactive)
    }

    clearProgram(){
        this.program=[]
        debug&&console.log("clearProgram");
    }
    tick(delta){
        this.etatEnCours && this.etatEnCours.tick(delta)
    }

    /**
     * called when an animation action is finish
     * @param {*} e 
     */
    onFinished(e){
        debug&&console.log("on finished",this.etatEnCours);
        this.etatEnCours.onActionFinished(e)
        if(this.etatEnCours.isTerminated){
            debug&&console.log("onFinished & terminated - state Set to next");

            this.setToNextState()

        }
        
            
    }

    logProg(){
        console.log("---prog---"+this.program.length+ (this.program.length?"\n"+this.program.map(e=>e.nom)+"\n----------":""))
    }
}