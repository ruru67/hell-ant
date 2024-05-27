import * as THREE from 'three';
import {Regisseur} from '../regisseur.js'
import {Cameras} from '../cameras.js'
import { Ground } from '../ground.js';
import {PanelsController} from '../panelsController.js'
// import { Admin } from '../admin/admin.js';
import {Ant_Messor} from '../antSpecies/messor/antMessor.js'
import { Transport } from '../transport.js';
import { Target } from '../target.js';
import { Player } from '../player.js';
import { Reine } from '../ants_roles/reine.js';
import { Ouvriere } from '../ants_roles/ouvriere.js';
import { Game } from './game.js';
import { Colony } from '../ants_colony.js';
import { HTML } from '../html.js';
import { Clock2 } from '../clock2.js';
// // const require = createRequire(import.meta.url);
// // const mysql = require('mysql');
// // import { createConnection } from 'mysql';

// const USE_WIREFRAME=false;

export class SandBox000 extends Game{
    speed=1
    scene
    textureLoader
    ground
    regisseur
    
    mouse 
    raycaster
    transport
    player
    panel

    totDelta=0
    elapsedTime=0
    frameLengthMS = 1/24;//60 fps
    previousTime = 0;
    // admin=new Admin();
    constructor(name="SandBox 000",description="Atteindre une cible"){
        super(name,description)
        this.domElement=HTML.addDiv("game-panel")
        document.body.append(this.domElement)
    }

    start(){
        this.scene= new THREE.Scene();
        this.textureLoader=new THREE.TextureLoader()
        this.ground = new Ground(this.scene,12,12)
        this.clock= new Clock2()
        this.mouse = new THREE.Vector2()
        this.raycaster =  new THREE.Raycaster()

        this.regisseur = new Regisseur(this.scene)
        this.regisseur.init3Lights()
        //Caméras
        this.cameras=new Cameras(this)
        this.cameras.setScene(this.scene)
        this.cameras.setDefaultCameras()

        
        //Player
        this.player=new Player(this,this.scene,this.textureLoader)
        this.player.buildPanel()
      
        let colony=new Colony(this,this.scene,"Colonie 1")
        // let foods=new Foods(this.scene,"Végétaux")
        // foods.setGame(this)
        this.player.addColony(colony)
        // colony.setOnAveragePositionUpdate(()=>{
        //     this.cameras.setPArent(0,colony.)
        // })
        this.cameras.lookAt(colony.averagePosition)

        colony.averagePosition.add(this.cameras.getCamera(4))
        // this.cameras.attachCameraToObject(colony.averagePosition,4)
        colony.loadGlbAndTextures([Ant_Messor]).then(e=>{
            let reine=colony.addAnt(Ant_Messor, Reine)
            // reine.addArrows(reine.obj,"position",.2)
            for(let i=0;i<3;i++){
                colony.addAnt(Ant_Messor, Ouvriere)
            }
            
            // this.selectAnt(reine)
            this.regisseur.addObjHighlighted(reine)

                this.isReady(()=>{
                    console.log("Start Animate")
                    this.appendTransport()
                    this.animate()
                    // this.cameras.setFov(16,1800)
                })

                //this.panel=PanelsController.createPanel(this.regisseur,this.cameras,colony)

            let target= new Target(this.scene)
            // let target= new TargetAnt0(this.scene)
            target.setPositionRandom(3)
            target.setOnReached(()=>{
                target.setPositionRandom(3)
            })
            colony.setTarget(target)

            this.cameras.renderer.domElement.addEventListener( 'click',(e)=>{ this.onCanvasMouseDown(e)} );
            window.addEventListener( 'keydown',(e)=>{this.onKeyDown(e)})
        })
    }
    
    addAxes(){
        const axesHelper = new THREE.AxesHelper( 5 );
        axesHelper.position.y=.00001
        this.scene.add( axesHelper )
    }

    appendTransport(){
        this.transport=new Transport(this)
        this.transport.buildPanel()
        this.transport.onPlay=()=>{ 
            this.play() 
        }
        this.transport.onStop=()=>{ 
            this.pause() 
        }
        this.transport.onForward=()=>{ 
            this.forward() 
        }
    }

    /**
     * Be carefull : ant must be part of the selected colony in this.player. Because that is not checked here
     * @param {Ant} ant 
     */
    selectAnt(ant){
        this.player.selectAnt(ant)
        this.player.updatePanel()
    }

    unselectAnts(unselectPanels=true){
        this.player.unselectColony(unselectPanels)
    }
    
    setSpeed(value){
        this.speed=value
        this.player.setAnimationMixerSpeed(value)
    }
    getSpeed(){
        return this.speed
    }

    play(){
        this.setSpeed(1)
        if(!this.transport.isPlaying()){
            this.clock.continue()
            this.animate()
        }
        else console.log("Cannot play! Already playing")
    }
    forward(){
        this.setSpeed(this.transport.speedForward)
        if(!this.transport.isPlaying()){
        this.clock.continue()
        this.animate()
        }
    }
    pause(){
        this.clock.pause()
    }

    animate() {
        super.animate()
        this.delta=this.clock.getDelta()
        
        for(let i=0;i<this.speed-1;i++){
            this.player.tick(this.delta,false)
            this.delta=1/24
            this.clock.moveForward(this.delta)
        }
        this.player.tick(this.delta)
        this.cameras.render(this.delta)
        
        // this.totDelta+=delta
        // if(this.clock.getElapsedTime() - this.previousTime > this.frameLengthMS){
        //     // this.player.tick(this.totDelta)
        //     this.regisseur.tick(this.totDelta)
        //     this.cameras.render(this.totDelta)
        //     this.previousTime = this.clock.getElapsedTime();
        //     this.totDelta=0
        // }
        if(!this.transport.isPlaying())
            return;
        requestAnimationFrame( ()=>{ this.animate() } );
    }

    
    onKeyDown(e){
        const key=e.key.toLowerCase()
        switch (key) {
            case "escape":
                if(this.player.panelActionOpened){
                    this.player.panel.hideActionsPanel(this.player.colony)
                    return
                }
                break;
            case "e":
                this.player.panel.showActionsPanel(this.player.colony)
                break;
            default:
                break;
        }
        
    }

    onCanvasMouseDown(e) {    
        // if(!e.ctrlKey && !e.shiftKey){
            e.preventDefault();
            if(this.player.panelActionOpened){
                this.player.panel.hideActionsPanel(this.player.colony)
                return
            }

            this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            this.raycaster.setFromCamera( this.mouse, this.cameras.getActiveCam() );
            let o
            
            if(this.cameras.getCamRaycastMode()){
                for(let ant of this.player.colony.getAnts()){
                    let intersects = this.raycaster.intersectObjects( ant.getMeshes(),true );
                    if(intersects.length>0){
                        o=ant
                        break;
                    }
                }
            }
            else{
                let intersects = this.raycaster.intersectObjects( [this.ground.getPlane()],false );
                if(intersects.length>0){
                    let minDist=Infinity
                    for(let ant of this.player.colony.getAnts()){
                        let dist = intersects[0].point.distanceToSquared(ant.getPosition())
                        if ( dist<0.03 && dist < minDist ) {
                            minDist=dist
                            o=ant;
                            if(dist<.002){
                                break;
                            }
                        }
                    }
                }
            }
            
            if(o){
                if(!this.player.colony.isSelected(o)){
                    if(!e.ctrlKey && !e.shiftKey)
                        this.unselectAnts()
                    this.selectAnt(o)
                    this.player.colony.updateAveragePosition()
                }
                else{
                    if(e.ctrlKey || e.shiftKey)
                        this.player.unselectAnt(o)
                    else{
                        this.unselectAnts(this.player.colony.selection.length===1)
                        this.selectAnt(o)
                    }
                }
            }
            else{
                if(!e.ctrlKey && !e.shiftKey)
                    this.unselectAnts()
            }
            if(!this.transport.isPlaying())  
                this.cameras.render()
        // }
    }
}