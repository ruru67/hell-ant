export class PanelsController{
    static createPanel(...o){
        const gui=new dat.GUI({ width: 280 });
        gui.domElement.lastChild.textContent+=" (h:hide/show)"
        gui.hide()
        // console.log("GUI",gui)
        for(let objet of o) {
            objet.setPanel(gui)
        }
        window.addEventListener("keydown",e=>{
            switch (e.key.toLowerCase()) {
                case "h":
                    this.toggle(gui);
                    break;
                default:
                    break;
            }
        })
        return gui
    }

    static toggle(gui){
        if(gui.domElement.style.display==="none"){
            gui.show()
        }
        else{
            gui.hide()
        }
    }
}