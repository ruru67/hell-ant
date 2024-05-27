import { Os } from "./os.js";
import { Graine } from "./food/graine.js";
import { O } from "./o.js";
const debug=false
export class Foods extends Os{
    name
    constructor(scene,name){
        super(scene)
        this.name=name
        // console.log("Foods.new : ",this.name)
    }
    /**
     * @param {Object} _class Classe de l'espece de fourmi voulue par exemple {@link Graine} ...
     * @param {Object} Role_class Classe de l'espece de fourmi voulue par exemple {@link Role} ...
     * @returns {O}
     */
    add(_class){
        debug&&console.log("Foods.add",_class);
        let food=new _class(this.scene,this);
        // food.setAnts(this)
        // food.setClock(this.clock)
        this.t.push(food)
        return food
        // return this.antsByRole
    }
    /**
     * @param {Object[]} Graine_classes Classes des especes requises ...
     */
    async loadGlbAndTextures(Graine_classes){
        let prom=[]
        prom.push(await this.loadGlb(Graine))
        for(let i=0; i<Graine_classes.length;i++){
            
            prom.push(await this.loadTextures(Graine_classes[i]))
        }
        return await Promise.all(prom)
    }
    // /**
    //  * @param {String} role 
    //  * @return {HTMLDivElement} description
    //  */
    // buildPanelRole(role){
    //     return this.antsByRole[role.name].buildColonyRoleDiv(this)
    // }

    
}