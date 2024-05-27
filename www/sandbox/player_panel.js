
import { Ants } from "./ants.js";
import { HTML, cloneTemplate } from "./html.js";
import { Player } from "./player.js"; 

export class PlayerPanel{
    player
    $colonyName
    $divColonyPopulation
    $divSelection
    $ulAntsByRole
    /**
     * 
     * @param {Player} player 
     */
    constructor(player){
        this.player=player
        const playerPanelFragment=cloneTemplate("tpl-player")
        player.game.domElement.append(playerPanelFragment)
        this.domElement=document.getElementById("div-player")
    }

    
    setPanelColony(colony){
        // console.log("panel setPanelColony")
        // const tplColo=document.getElementById("tpl-colonie")
        const $divColonie= cloneTemplate("tpl-colonie")
        
        this.domElement.append($divColonie)
        this.$colonyName=document.querySelector(".colony-name")
        this.$colonyName.value=colony.name
        this.$colonyName.addEventListener("keydown",(e)=>{
            if(e.key==="Enter"){
                e.target.blur()
            }
            colony.setName(this.$colonyName.value)
        })
        this.updateColonySpecie(colony)
        this.updateColonyPopulation(colony)
        
        this.$divColonyPopulation=document.querySelector(".div-colony-population")
        this.$divAntsActions=document.querySelector(".div-ants-action")
       
        this.setPanelAntsByRole(colony)

        // const fragmentSelections=cloneTemplate("tpl-selections")
        // this.domElement.append(fragmentSelections)
        // this.$divSelection=document.querySelector(".player-selection")
    }

    updateColonySpecie(colony){
        // console.log("panel updateColonySpecie")
        const $lblColoSousFamille=document.getElementById("lblColoSousFamille")
        $lblColoSousFamille.textContent=colony.getSubFamily()
        const $lblColoGenre=document.getElementById("lblColoGenre")
        $lblColoGenre.textContent=colony.getGenus()
        const $lblColoEspece=document.getElementById("lblColoEspece")
        $lblColoEspece.textContent=colony.getSpecie()
    }

    updateColonyPopulation(colony){
        const $lblColoNbFourmis=document.getElementById("lblColoNbFourmis")
        $lblColoNbFourmis.textContent=colony.getLength()
    }



    setPanelAntsByRole(colony){
        // console.log("panel setPanelAntsByRole");

        // this._antsByRole=antsByRole//not needed
        const antsByRole=colony.getAntsByRole()

        for(let role in antsByRole) {
            this.$divColonyPopulation.append( colony.buildPanelRole(role) )
            // let div=antsByRole[role].role_class.buildColonyRoleDiv(colony)
            // // let div=this.buildColonyRoleDiv(colony,role)
            
            // this.$divAntsActions.append(div)
        }
    }
    

    
    

    updateSelection(colony){
        this.unselectAllRoles(colony)
        colony.getRolesMatchingSelection().forEach(role => {
            colony.antsByRole[role].domElement && colony.antsByRole[role].domElement.classList.add("selected")
            this.player.panelActionOpened=true
            colony.antsByRole[role].$divColonyRoleActions.classList.remove("d-none")

        });
        // colony.updateAveragePosition()

    }

    /**
     * May probably be deprecated when Roles will be instantiated (directly done in the Role class!)
     * @param {Ants} colony 
     */
    unselectAllRoles(colony){
        for(let role in colony.antsByRole) {
            colony.antsByRole[role].domElement && colony.antsByRole[role].domElement.classList.remove("selected")
            // colony.antsByRole[role].$divColonyRoleActions.classList.add("d-none")
        }
        this.hideActionsPanel(colony)
    }

    /**
     * May probably be deprecated when Roles will be instantiated (directly done in the Role class!)
     * @param {Ants} colony 
     */
    hideActionsPanel(colony){
        // console.log("hide panel");
        for(let role in colony.antsByRole) {
            colony.antsByRole[role].$divColonyRoleActions.classList.add("d-none")
        }
        this.player.panelActionOpened=false
    }
}