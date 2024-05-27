
import { HTML } from "./html.js"
const cssFile=`
    .divMenuRond {
        position: fixed;
        width: 48px;
        height: 48px;
        z-index: 300;
        
        left: 430px;
        top: 552px;
    }
`
//opacity: 0.8;
// transform: scale(0.6);

export class MenuRond{
    static cssLoaded=false

    domElement
    elts=[]
    constructor(x,y,r=window.innerHeight/4){
        this.buildMenu()
        this.r=r
        this.x=x
        this.y=y
    }
    buildMenu(x,y){
        
        if(!MenuRond.cssLoaded){
            HTML.loadcssfile(cssFile)
            MenuRond.cssLoaded=true
        }
        this.domElement=HTML.addDiv("divMenuRond")
        this.onResize()
        
        document.addEventListener("load",()=>{
            this.document.append(this.domElement)

        })
        window.addEventListener("resize",()=>{
            this.onResize()
        })
    }

    onResize(){
        if(!this.x)
            this.domElement.style.left=Math.floor(window.innerWidth/2)+"px"
        if(!this.y)
            this.domElement.style.top=Math.floor(window.innerHeight/2)+"px"
        this.update()
    }

    addElement(elt){
        // elt.classList.add("mr-elt")
        this.domElement.append(elt)
        this.elts.push(elt)
        this.update()
    }

    update(eltsSize=50){
        const a=Math.PI*2 / this.elts.length
        let i=0
        let r=Math.min(this.r,Math.floor(window.innerHeight/4),Math.floor(window.innerHeight/4))
        for(let elt of this.elts){
            let x=r*Math.cos(a*i)-eltsSize
            let y=r*Math.sin(a*i)-eltsSize
            elt.style.left= x+"px";
            elt.style.top= y+"px";
            i++
        }
    }

}

