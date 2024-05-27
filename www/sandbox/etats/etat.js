const debug=false

export class Etat{
    static nom="erreur class abstraite"
    static libelle=""
    static needsStop=false
    static canRepeat=false

    static getName(){
        return this.nom
    }

    mae
    o;
    nom;
    libelle;
    _constructor;
    isTerminated=false
    step=0
    constructor(mae,nom, libelle){
        debug&&console.log("**New Etat : "+nom)
        this.mae=mae
        this.o=mae.o
        this.nom=nom
        this.libelle=libelle
        
        this.init()
    }
    
    init(){
        
    }

    // setConstructor(constructor){
    //     this._constructor=constructor
    // }

    
    tick(delta){
        if(this.o.currentAction && this.o.currentAction.isRunning){
            this.o.currentAction.setEffectiveTimeScale(this.o.actions[this.o.currentAction._clip.name].timescale*delta)//timeScale=
        }
    }
    start(){
        
    }
    
    onActionFinished(){
        this.isTerminated=true
        
    }
}

