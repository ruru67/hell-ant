import { O } from "./o.js";
import * as THREE from 'three';

const debug=false
export class AnimatedO extends O{
    static actionsDefinitions={
        "additives":[],
        "nonadditives": [],
    }


    //INSTANCE
    actions={}
    nonadditiveClips={}
    additiveClips={}
    setGltf(gltf,fps){
        super.setGltf(gltf)
        this.clips=gltf.animations;
        if (this.clips.length>0){
            this.setAnimationMixer()
            this.setAnimations()
        }
    }
    cloneGltf(gltf){
        let ng=super.cloneGltf(gltf)
        ng.animations=gltf.animations
        return ng
    }

    setAnimationMixer(){
        this.mixer =new THREE.AnimationMixer(this.gltf.scene)
        
        debug&&console.log("o set new miwer",this.mixer)

        this.mixer.addEventListener("finished",(e)=>{
            if(!e.action.clampWhenFinished)
                e.action.stop()
            this.mae.onFinished(e)
            this.nbActions--
        })
    }

    setAnimations(timescale=300){
        debug&&console.log("Animations",this.clips)
        // console.log("--non additiv Animations:",this.constructor.actionsDefinitions.nonadditives)
        // console.log("--additiv Animations:",this.constructor.actionsDefinitions.additives)

        //set nonadditives actions
        for(let additivOrNot in this.constructor.actionsDefinitions){
            this.constructor.actionsDefinitions[additivOrNot].forEach((actionDef)=>{
                let clip=THREE.AnimationClip.findByName(this.clips,actionDef.name) 
                if(clip){
                    if(additivOrNot==="additives")
                        THREE.AnimationUtils.makeClipAdditive(clip)

                    let action=this.mixer.clipAction(clip)
                    if(actionDef.timeScale){
                        this.actions[actionDef.name]={timescale:actionDef.timeScale*timescale}
                        action.setEffectiveTimeScale (actionDef.timeScale);
                    }
                    if(actionDef.loop){
                        action.setLoop (actionDef.loop,Infinity);
                    }   
                    if(actionDef.clampWhenFinished)
                        action.clampWhenFinished=true

                    if(additivOrNot==="nonadditives")
                        this.nonadditiveClips[clip.name]=action
                    else{
                        // THREE.AnimationUtils.makeClipAdditive(clip)
                        this.additiveClips[clip.name]=action
                    }

                }
                else{
                    console.warn("Nonadditives Action : '"+actionDef.name+"' not found in gltf")
                }
            })
        }
    }

    play(name,nonadditive=true,weight=1){

        const rep=nonadditive?this.nonadditiveClips:this.additiveClips
        // console.log("play "+name,nonadditive)
        rep[name].reset()
        rep[name].enabled=true
        // rep[name].pause=false
        rep[name].setEffectiveWeight(weight)
        // rep[name].blendMode=nonadditive?THREE.NormalAnimationBlendMode:THREE.AdditiveAnimationBlendMode
        // const delta=this._ants.player.game.delta
        // rep[name].setEffectiveTimeScale(this.actions[name].timescale*delta)
        rep[name].play();
        // this.currentAction=rep[name]

        if(nonadditive)
            this.currentAction=this.nonadditiveClips[name]
    }
    fadeOut(name,nonadditive=true,delay=1){
        const rep=nonadditive?this.nonadditiveClips:this.additiveClips
        rep[name].fadeOut(delay)
    }
    stop(name,nonadditive=true){
        const rep=nonadditive?this.nonadditiveClips:this.additiveClips
        rep[name].stop()
    }
    // playClamped(name,nonadditive=true){
    //     const rep=nonadditive?this.nonadditiveClips:this.additiveClips

    //     rep[name].clampWhenFinished=true
    //     this.play(name,nonadditive)
    // }
    setPanel(parent){
        const fAnimations=parent.addFolder('Animations')

        fAnimations.open()
        // if(this.nonadditiveClips.length>0){
            fAnimations.add(this.mixer,"timeScale",1,100,0.1).listen()

            const fnonaddit=fAnimations.addFolder("nonaddit")
            for(let clipName in this.nonadditiveClips){
                this._setPanelClip(fnonaddit,this.nonadditiveClips[clipName])
            }
        // }
        // if(this.additiveClips.length>0){
            const faddit=fAnimations.addFolder("addit")
            for(let clipName in this.additiveClips){
                this._setPanelClip(fnonaddit,this.additiveClips[clipName])
            };
        // }
        return fAnimations;
    }
    _setPanelClip(parent,clip){
        const fClip=parent.addFolder(clip._clip.name)
        fClip.add(clip._clip,"name").onChange( e=>{
            debug&&console.log(e,fClip)
            fClip.name=e
        })
        // console.log(clip);
        fClip.add(clip._clip,"duration",0.01)
        fClip.add(clip,"loop",{once:THREE.LoopOnce,repeat:THREE.LoopRepeat,pingpong:THREE.LoopPingPong})

        fClip.add(clip,"timeScale",0,20,.01)
    }

    tick(delta,updateGFX=true){
        super.tick(delta)
        this.mixer && updateGFX && this.mixer.update(delta)
    }
}