import { HTML } from '../html.js';
import * as THREE from 'three';
// import { Octree } from 'three/addons/math/Octree.js';
// import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
// import { Capsule } from 'three/addons/math/Capsule.js';
export class Game{
    name
    $divGame
    $divSplash
    /**{Clock} clock */
    clock
    iLoop=0
    constructor(name="undefined",description,detail=""){
        console.log("new Game",this)
        this.name=name
        this.description=description
        this.detail=detail
        this.$divGame=document.getElementById("div-game")
        this.$divSplash=document.getElementById("div-splash")
        this.$pSplashGameName=document.getElementById("splash-game-name")
        this.$pSplashDescription=document.getElementById("splash-game-description")
        this.$pSplashDetail=document.getElementById("splash-game-detail")

        this.$pSplashState=document.getElementById("splash-game-state")
        this.setSplashScreen(this.name+" - "+this.description, this.detail)
        this.showSplashScreen()

        this.$divGameHeader=HTML.addDiv("margin-1 padding-1")
        this.$divGameHeader.append(HTML.addH(name,4,"margin-0"))
        this.$divGameHeader.append(HTML.addDiv(null,description))

        this.$divClock=document.getElementById("div-clock","margin-1 padding-1")
        this.$divGameHeader.append(this.$divClock)
        this.$divGame.append(this.$divGameHeader)
    }
    setSplashScreen(name,description,state="Loading..."){
        this.$pSplashGameName.textContent=name
        this.$pSplashDescription.textContent= description
        this.$pSplashState.textContent=state
    }
    getName(){
        return this.name
    }
    showSplashScreen(){
        this.$divSplash.classList.remove("d-none")
    }
    removeSplashScreen(){
        this.$divSplash.remove()
    }
    splashState(text){
        this.$pSplashState.textContent=text
    }

    isReady( onClick=()=>{ this.animate() } ){
        this.splashState("Clic pour commencer")
        this.$divSplash.addEventListener("click",(e)=>{
            e.preventDefault()
            onClick()
            this.removeSplashScreen()
        })
    }

    animate() {
        if(this.iLoop%30===0)
            this.updateDate()
        this.iLoop++

    }
    updateDate(){
        const elapsed=Math.floor(this.clock.elapsedTime)
        let days=Math.floor(elapsed/86400)
        let rest=elapsed%86400
        let hours=Math.floor(rest/3600)
        rest=rest%3600
        
        let minutes=Math.floor(rest/60)
        let secondes=rest%60

        this.$divClock.textContent=days+"j "+hours+"h "+minutes+"m "+secondes+"s"
    }

    
}