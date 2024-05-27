import { HTML, cloneTemplate } from "../html.js";
import { Inactive } from '../etats/inactive.js';
import { Explore } from '../etats/explore.js';
import { Va } from '../etats/va.js';
import { Tik } from '../etats/tik.js';
import { Nettoyage } from '../etats/nettoyage.js';
import { Rentre } from '../etats/rentre.js';
import { Dormir } from "../etats/dormir.js";
import {capitalizeFirstLetter} from "../js-utils-text.js";
import { MenuRond } from "../html-menu-rond.js";
import { OpenMandibles } from "../etats/ouvre_mandibules.js";
// import { Ants } from "../ants.js";
// import { Colony } from "../ants_colony.js";
const debug=false
export class Role{
    static name="undefined"
    static scale=1
    static selectLineWidth=1
    static etats_possibles_role=[]
    static etats_possibles=[
        Inactive,
        Dormir,
        Explore,
        Va,
        Tik,
        Nettoyage,
        Rentre,
    ]
    static color=0xaaaaaaa

    static getEtatsPossibles(){
        // return this.etats_possibles
        return this.etats_possibles.concat(this.etats_possibles_role)
    }
    
    

    static updatePanel(){

    }

    //////////////////////////////////////////////////////////////////////////////
    // Instance 
    // colony
    role_class
    colony
    $title
    $lblNbAntByRole
    $divColonyRoleActions
    constructor(){
        // this.colony=colony
        this.role_class=this.constructor
        // this.ants=new Ants(colony.player,colony.player.scene)
    }

    setRoleClass(role){
        // this.role_class=this.constructor//role
    }

    addAnt(ant){
        this.ants.tAnts.push(ant)
        this.update()
    }
    buildColonyRoleDiv(colony){
        this.colony=colony
        const antsByRole=colony.getAntsByRole()
        this.domElement=HTML.addDiv("div-colony-role padding-x-1")//+(role==="reine"?" selected":""))
        this.$title=HTML.addH(
            capitalizeFirstLetter(this.constructor.name)+ (antsByRole[this.constructor.name].ants.getLength()>1?"s":""),
            5,
            "margin-0 text-center pointer-events-none"
        )
        let divHead=HTML.addDiv("div-colony-role-head")
        divHead.append(this.$title)
        this.$lblNbAntByRole=HTML.addLabel(antsByRole[this.constructor.name].ants.getLength())
        divHead.append(this.$lblNbAntByRole)
        this.update()
        this.domElement.append(divHead)
        // antsByRole[this.name].domElement=div;
        this.domElement.addEventListener('click', (e)=>{
            if(!e.shiftKey&&!e.ctrlKey){
                colony.unselectAll()
                if(!this.domElement.classList.contains("selected")){//select
                    // this.unselectAllRoles(colony)
                    colony.player.panel.unselectAllRoles(colony)
                    antsByRole[this.constructor.name].ants.selectAll().forEach(ant=>{
                        colony.player.game.selectAnt(ant)

                    })
                    colony.player.updatePanel()
                    colony.updateAveragePosition()
                    this.domElement.classList.add("selected")
                }
                else{
                    this.domElement.classList.remove("selected")
                    this.$divColonyRoleActions.classList.add("d-none")
                }   
                if(colony.player.game.transport && !colony.player.game.transport.isPlaying())  
                    colony.player.game.cameras.render()
            }
        })
        debug && console.log("Role",antsByRole[this.constructor.name])
        this.$divColonyRoleActions=this._buildColonyRoleActionsDiv()
        colony.player.panel.$divAntsActions.append(this.$divColonyRoleActions)
        return this.domElement
    }


    // _buildColonyActionsDiv(colony){
    //     let div=new MenuRond().domElement
    //     // let div=HTML.addDiv("","div-colony-role-actions padding-x-1 d-none")
    //     this.constructor.getEtatsPossibles().forEach(etat=>{
    //         // console.log(etat)
    //         let bt=HTML.addButton(etat.getName())
    //         bt.addEventListener("click",(e)=>{
    //             e.preventDefault()
    //             e.stopPropagation()
    //             console.log("set state from",this.ants)
    //             this.colony.getSelection().forEach(ant=>{
    //                 if(ant.role_class===this.constructor)
    //                     ant.setState(etat)
    //             })
    //         })
    //         div.append(bt)
    //     })
    //     return div
    // }

    updateColonyActionsDiv(){

    }

    _buildColonyRoleActionsDiv(eltsSize=100){
        let menuRond=new MenuRond()
        menuRond.domElement.classList.add("d-none")
        this.constructor.getEtatsPossibles().forEach(etat=>{
            let bt=HTML.addButton(etat.getName(),"bt bt-action")
            bt.addEventListener("click",(e)=>{
                e.preventDefault()
                e.stopPropagation()
                e.target.blur()
                console.log("set state from",this.ants)
                this.colony.getSelection().forEach(ant=>{
                    if(ant.role_class===this.constructor)
                        ant.userSetState(etat)
                })
                this.colony.player.panel.hideActionsPanel(this.colony) 
            })
            bt.style.width=eltsSize+"px";
            bt.style.height=eltsSize+"px";
            bt.style["border-radius"]= (eltsSize/2)+"px"
            menuRond.addElement(bt)
        })
        return menuRond.domElement
    }

    /** TMP */
    // _buildColonyRoleActionsDiv(colony){
    //     let div=HTML.addDiv("div-colony-role-actions padding-x-1 d-none")
    //     this.constructor.getEtatsPossibles().forEach(etat=>{
    //         // console.log(etat)
    //         let bt=HTML.addButton(etat.getName())
    //         bt.addEventListener("click",(e)=>{
    //             e.preventDefault()
    //             e.stopPropagation()
    //             console.log("set state from",this.ants)
    //             this.colony.getSelection().forEach(ant=>{
    //                 if(ant.role_class===this.constructor)
    //                     ant.setState(etat)
    //             })
    //         })
    //         div.append(bt)
    //     })
    //     return div
    // }

    update(){
        this.$title.textContent=capitalizeFirstLetter(this.constructor.name)+ (this.ants.getLength()>1?"s":"")
        this.$lblNbAntByRole.textContent=this.ants.getLength()
    }
}