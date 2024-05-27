import * as THREE from 'three';
import {Ant} from './ant.js'
import {Ant_Messor} from './antSpecies/messor/antMessor.js'
import { Inactive } from './etats/inactive.js';
import { Explore } from './etats/explore.js';
import { Nettoyage } from './etats/nettoyage.js';
import { Rentre } from './etats/rentre.js';
import { Os } from './os.js';
import { Target } from './target.js';
import { Va } from './etats/va.js';
import { Role } from './ants_roles/role.js';
import { Reine } from './ants_roles/reine.js';
import { Ouvriere } from './ants_roles/ouvriere.js';



export class Ants extends Os{
    isColony=false
    tAnts=[]
    averagePosition=new THREE.Object3D()
    roles=[]
    antsByRole={}
    player
    specie //espèce de la 1ere fourmi du groupe
    specieClass
    tRoles=[Reine,Ouvriere]
    followingTarget=false;
    castShadow=true
    receiveShadow=false
    // timeScale=2000
    perceptionRadius=0.31//281//0.18
    separationFactor=0.23//0.265//0.00671//0.00085
    separationExpFactor=0.542//0.01//0.06
    separationInterval=0.1165//0.414//0.081
    separate=true
    cptFrame=0
    onAveragePositionUpdate=()=>{}

    deltaSeparation=0
    constructor(player,scene){
        super(scene)
        this.player=player
        scene.add(this.averagePosition)
    }

    // isColony(){
    //     return this.constructor===Colony
    // }
    // getSelection(){
    //     return this.selection.length>0?this.selection:this.tAnts
    // }

    selectAll(){
        this.tAnts.forEach(ant=>{
            this.selectAnt(ant)
        })
        return this.selection
    }

    selectAnt(ant){
        super.select(ant)
       
    }
    unselectO(o){
        super.unselectO(o)
        const role=this.antsByRole[o.getRole().name]
        console.log("ants.unselect(o)",o.getRole().name)

        if(role.ants.selection.length>0){
            for(let i=role.ants.length-1; i>=0;i--){
                if(o===role.ants[i]){
                    role.ants.splice(i,1)
                    console.log("os.unselect o");
                }
            }
            role.domElement.classList.remove("selected")
        }
    }

    unselectAll(){
        this.tAnts.forEach(o=>{
            o.unselect()
            // this.unselectO(o)
        })
        this.selection=[]
    }
    
    setAnts(ants){
        this.tAnts=ants
    }
    /**
     * @param {Object} Ant_Specie_class Classe de l'espece de fourmi voulue par exemple {@link Ant_Messor} ...
     * @param {Object} Role_class Classe de l'espece de fourmi voulue par exemple {@link Role} ...
     * @returns {Ant}
     */
    addAnt(Ant_Specie_class,Role_class){
        // console.log("Ants.addAnt");
        let ant=new Ant_Specie_class(this.scene,Role_class);
        ant.setAnts(this)
        // ant.setClock(this.clock)
        this.tAnts.push(ant)
        
        
        return ant
        // ant.addArrows(ant.obj,"position",.3)
    }
    

    get(numObjet){
        return this.tAnts[numObjet]
    }

    getAnts(){
        return this.tAnts
    }

    
    getAntsByRole(){
        
        return this.antsByRole
    }

    getRolesMatchingSelection(){
        let tRoles=[]
        this.selection.forEach(antSel=>{
            if(!this.tRoles.includes(antSel.getRole().name))
                tRoles.push(antSel.getRole().name)
        })
        return tRoles
    }

    getSpecie(){
        return this.specieClass?this.specieClass.specie:""
    }

    getSubFamily(){
        return this.specieClass?this.specieClass.subFamily:""
    }
    getGenus(){
        return this.specieClass?this.specieClass.genus:""
    }

    getLength(){
        return this.tAnts.length
    }
    
    setPlayer(player){
        this.player=player
    }
    getPlayer(player){
        return this.player
    }

    setTarget(target){
        this.tAnts.forEach(ant=>{
            ant.setTarget(target)
        })
    }

    separation(delta){
        for (let ant of this.tAnts){
            if(ant.isWalking()) 
                ant.separation(this.tAnts,delta)
            
        }
    }


    updateAveragePosition(){
        let nbSel=0
        this.memPosition=this.averagePosition.position.clone()
        this.averagePosition.position.set(0,0,0)
        this.tAnts.forEach(ant=>{
            if(ant.selected){
                this.averagePosition.position.add(ant.getPosition())
                nbSel++
            }
        })
        if(nbSel>0){
            this.averagePosition.position.divideScalar(nbSel)
        }
        else{
            this.averagePosition.position.set(this.memPosition.x,this.memPosition.y,this.memPosition.z)
        }  
        this.averagePosition.position.y=0.04 //à hauteur des yeux

    }
    setOnAveragePositionUpdate(f){
        this.onAveragePositionUpdate=f
    }

    tick(delta,updateGFX=true){
        // this.cptFrame++
        if(this.separate){
            this.deltaSeparation+=delta
            if (this.deltaSeparation>=this.separationInterval){
                // let ratio=Math.floor( this.deltaSeparation /this.separationInterval)
                // this.separation(this.deltaSeparation*ratio)
                // this.deltaSeparation-=ratio*this.separationInterval

                this.separation(this.deltaSeparation)
                this.deltaSeparation=0
                // this.cptFrame=0
            }
        }
        
        this.tAnts.forEach(ant => {
            ant.tick(delta,updateGFX)
        });
        if(updateGFX)
            this.updateAveragePosition()

    }

    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    setPanel(parent){
        const fAnts=parent.addFolder('Ants')
        // fAnts.open();
        fAnts.add(this,"visible")
        fAnts.add(this,"castShadow").onChange(e=>{
            this.tAnts.forEach(ant => {
                ant.setCastShadow(e)
            })
        })
        fAnts.add(this,"receiveShadow").onChange(e=>{
            this.tAnts.forEach(ant => {
                ant.setReceiveShadow(e)
            })
        })
        fAnts.add(this,"followingTarget").onChange(e=>{
            let action=e?Va:Explore
            this.tAnts.forEach(ant => {
                // ant.followingTarget=e
                ant.setState(action)

            })
        })

        fAnts.add(this,"separate")

        fAnts.add(this,"perceptionRadius",0.01,0.5,.001).onChange(e=>{
            this.tAnts.forEach(ant => {
                ant.setPerceptionRadius(e)
            })
        })

        

        fAnts.add(this,"separationFactor",0.00001,.5,.00001)
        fAnts.add(this,"separationExpFactor",0.01,10,.001)
        fAnts.add(this,"separationInterval",0.01,1,.001)
        
        // const antsNames={tAntsName:this.tAnts.map(e=>e.getName())}
        // console.log(antsNames)

        let antsByName={}
        this.tAnts.forEach(ant => {
            antsByName[ant.name]=ant.name
            // ant.setPanel(fAnts)
        })
        fAnts.add(this.tAnts[0],"name",antsByName)
        this.tAnts[0].setPanel(fAnts)
    }
}