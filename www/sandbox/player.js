import { Colony } from './ants_colony.js';
import { PlayerPanel } from './player_panel.js';

export class Player{
    game
    scene
    colony  //-> active colony
    tColonies=[]
    textureLoader
    panel
    panelActionOpened=false
    /**
     * 
     * @param {Colony} colony 
     */
    constructor(game,scene, textureLoader){
        this.game=game
        this.scene=scene
        this.textureLoader=textureLoader
    }
    

    getActiveColony(){
        return this.colony
    }

    getColoniesLength(){
        return this.tColonies.length
    }

    addColony(colony){
        this.colony=colony
        colony.player=this
        if(this.textureLoader)
            this.colony.setTextureLoader(this.textureLoader)
        
        this.tColonies.push(this.colony)

        this.panel && this.panel.setPanelColony(this.colony)
        return this.colony
    }
    
    selectAnt(ant){
        this.colony.select(ant)
    }
    unselectAnt(ant){
        this.colony.unselectO(ant)
    }
    unselectColony(unselectPanels=true){
        // console.log("unselectColony",this.colony)
        unselectPanels && this.panel.unselectAllRoles(this.colony)
        this.colony.unselectAll()
    }

    buildPanel(){
        this.panel=new PlayerPanel(this)

        // this.tColonies.forEach(colony=>{
        //     this.panel.setPanelColony(colony)
        // })
    }
    /**
     * 
     * @returns {PlayerPanel}
     */
    getPanel(){
        return this.panel
    }

    updatePanel(){
        if(this.panel && this.colony){
            this.panel.updateSelection(this.colony)
        }
    }

    setAnimationMixerSpeed(value){
        this.tColonies.forEach(colony=>{
            colony.setAnimationMixerSpeed(value)
        })
    }

    tick(delta,updateGFX=true){
        this.tColonies.forEach(colony=>{
            colony.tick(delta,updateGFX)
        })
    }
}