import {  HTML, cloneTemplate } from "./html.js";
    
export const TRANSPORT_STATES={play:"Play",stop:"Stop",forward:"Forward"}
const SPEEDS=[2,5,10,100,1000,2500,5000]

export class Transport{
    game
    state=TRANSPORT_STATES.play
    speedForward=2
    onPlay=()=>{}
    onStop=()=>{}
    onForward=()=>{}
    $domElement
    $gameSpeed
    $btPlay
    $btStop
    $gameSpeedDiv
    $btToggleSpeed
    $divSpeeds
    constructor(game){
        this.game=game
        // window.addEventListener("load",this.init)
        window.addEventListener("keydown",(e)=>{
            this.keyDown(e)
        })
    }

    getState(){
        return this.state
    }

    isPlaying(){
        return this.state===TRANSPORT_STATES.play || this.state===TRANSPORT_STATES.forward
    }

    keyDown(e){
        if(e.key===" "){
            switch(this.state){
                case TRANSPORT_STATES.stop:
                    this.play()
                    break
                case TRANSPORT_STATES.play:
                case TRANSPORT_STATES.forward:
                    this.stop()
                    break
            }
        }
        // e.preventDefault()
    }

    setState(state){
        this.state=state
        // console.log("transport.setState",state);

        for(let bt of this.domElement.children){
            if(bt.tagName=== "BUTTON"){
                if(bt.value===state){
                    this["$bt"+bt.value].classList.add("selected")
                    // console.log("set state",bt.value,state,this["$bt"+bt.value])
                }
                else
                    this["$bt"+bt.value].classList.remove("selected")
            }
        }
    }
    play(){
        
        if(this.state===TRANSPORT_STATES.play)
            return
        // if(this.isPlaying())
        //     this.stop()
        // else{

        this.game.setSpeed(1)
        let  previousState=this.state
        this.setState(TRANSPORT_STATES.play)

        if(previousState===TRANSPORT_STATES.stop){

            this.game.clock.continue()
            this.game.animate()
        }

        // }
        
    }

    stop(){
        this.setState(TRANSPORT_STATES.stop)
        this.game.clock.pause()
    }

    forward(){
        if(!this.isPlaying())
            this.play()
        
            // this.play()
        this.setState(TRANSPORT_STATES.forward)
        this.game.setSpeed(this.speedForward)
            
        
    }

    buildPanel(){
        const transportFragment=cloneTemplate("tpl-transport")
        this.game.domElement.append(transportFragment)
        this.domElement=document.querySelector(".panel-transport")
        this._buildSpeedDiv()
        this.$gameSpeed=document.querySelector(".game-speed")
        this.$gameSpeed.addEventListener("change",(e)=>{
            console.log("change vitesse",e)
            this.game.setSpeed(e.target.value)
        })
        this.$btPlay=document.querySelector(".game-play")
        this.$btPlay.addEventListener("click",(e)=>{
            this.play()
            e.target.blur()

        })
        this.$btStop=document.querySelector(".game-stop")
        this.$btStop.addEventListener("click",(e)=>{
            this.stop()
            e.target.blur()

        })
        this.$btForward=document.querySelector(".game-forward")
        this.$btForward.addEventListener("click",(e)=>{
            this.forward()
            e.target.blur()
        })
    }
    _buildSpeedDiv(){
        this.$gameSpeedDiv=document.querySelector(".game-speed")
        this.$btToggleSpeed=this.$gameSpeedDiv.children[0]
        this.$btToggleSpeed.addEventListener("click",()=>{
            this.$divSpeeds.classList.toggle("d-none")
        })
        this.$divSpeeds=this.$gameSpeedDiv.children[1]


        for (let speed of SPEEDS){
            let bt=HTML.addButton("x"+speed,"bt")
            bt.value=speed
            bt.tabIndex="-1"
            this.$divSpeeds.append(bt)
        }
        this.$divSpeeds.children[0].classList.add("d-none")
        this.$divSpeeds.addEventListener("click",(e)=>{
            if(e.target.tagName=== "BUTTON"){
                this.updateSpeed(e)
                this.forward()
            }
        })
    }

    updateSpeed(e){
        for(let bt of this.$divSpeeds.children){
            bt.classList.remove("d-none")
        }
        e.target.classList.add("d-none")
        this.$btToggleSpeed.textContent="x"+e.target.value
        this.$divSpeeds.classList.add("d-none")
        this.speedForward=parseInt(e.target.value,10)
        
    }
}