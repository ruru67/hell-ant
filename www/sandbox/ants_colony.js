import { Fourmiliere } from "./fourmiliere/fourmiliere.js";
import { Ant } from "./ant.js";
import { Ants } from "./ants.js";
import { Constructions } from "./constructions/constructions.js";
import { CheckPoint } from "./checkpoint.js";

const debug = false
export class Colony extends Ants{
    isColony=true
    name
    tFourmilieres=[]
    /** @var {Constructions} */
    constructions
    fourmiliere
    base
    constructor(player,game,name){
        super(player,game.scene)
        this.name=name
        console.log("Colony.new : ",this.name)
        this.constructions=new Constructions(game)
        this.constructions.setColony(this)
        this.constructions.addGranary(game.ground.getObject(),0,game.ground.getYFromXZ(0,.4),.4)
        this.base=new CheckPoint(game.scene)
        this.base.setPosition(0,game.ground.getYFromXZ(0,0),0)
        game.scene.add(this.base.buildObj())
        // this.fourmiliere=new Fourmiliere(game.scene)
        // this.fourmiliere.setPosition(0,game.ground.getYFromXZ(0,0),0)
        // this.fourmiliere.buildObj()
        // this.tFourmilieres.push(this.fourmiliere)
    }
    /**
     * @param {Object} Ant_Specie_class Classe de l'espece de fourmi voulue par exemple {@link Ant_Messor} ...
     * @param {Object} Role_class Classe de l'espece de fourmi voulue par exemple {@link Role} ...
     * @returns {Ant}
     */
    addAnt(Ant_Specie_class,Role_class){
        let ant = super.addAnt(Ant_Specie_class,Role_class)
        ant.setBase(this.base)
        // ant.followSlope()
        if(this.tAnts.length===1){
            this.specieClass=Ant_Specie_class
            debug && console.log({"player panel":this.player.panel})
            if(this.player.panel)
                this.player.panel.updateColonySpecie(this)
            else
                console.warn("player pas de panel");

        }
        // this.sortAntByRole(ant)
        const role=ant.getRole()
        if(!this.roles.includes(role)){
            // console.warn(role,ant.getColony())
            this.roles.push(role)
            this.antsByRole[role.name]=new role()//this
            this.antsByRole[role.name].setRoleClass(role)
            this.antsByRole[role.name].ants=new Ants(this.player,this.scene)
            
            if(this.player.panel){
                this.player.panel.$divColonyPopulation.append(this.buildPanelRole(role))
                
            }
            else{
                console.warn("pas de panel de joueur");
            }
        }
        this.antsByRole[role.name].addAnt(ant)
        this.player.panel && this.player.panel.updateColonyPopulation(this)
        return ant
        // return this.antsByRole
    }

    getGranary(){
        return this.constructions.getGranary()
    }
    /**
     * @param {String} role 
     * @return {HTMLDivElement} description
     */
    buildPanelRole(role){
        return this.antsByRole[role.name].buildColonyRoleDiv(this)
    }

    setAnimationMixerSpeed(value){
        this.tAnts.forEach(ant=>{
            ant.setAnimationMixerSpeed(value)
        })
    }
}