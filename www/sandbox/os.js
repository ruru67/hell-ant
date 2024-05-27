import * as THREE from 'three'
// import {sRGBEncoding} from 'three'
import {Ant_Messor} from './antSpecies/messor/antMessor.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Target } from './target.js';

const debug=false

export class Os{
    scene;
    /**
     * @var {GLTFLoader} GltfLoader
     */
    GltfLoader
    textureLoader;
    visible=true;
    tGlb={}
    t=[]
    selection=[]
    name
    castShadow=true
    receiveShadow=false
    constructor(scene){
        this.scene=scene
        if(!this.GltfLoader)
            this.GltfLoader=new GLTFLoader();
    }
    setGame(game){
        this.game=game
    }
    getGame(){
        return this.game
    }
    setName(name){
        this.name=name
    }
    getName(){
        return this.name
    }
    getAll(){
        return this.t
    }
    getSelection(){
        return this.selection
    }
    isSelected(o){
        // console.log("o is selected?",o,this.selection);
        for (let oSel of this.selection){
            if(o===oSel){
                return true
            }
        }
        return false
    }
    select(o){
        this.selection.push(o)
        o.select()
    }
    unselectO(o){
        // console.log("unselect o");
        o.unselect()
        for(let i=this.selection.length-1; i>=0;i--){
            if(o===this.selection[i]){
                this.selection.splice(i,1)
                console.log("os.unselect o");
            }
        }
    }
    unselect(){
        this.selection.forEach(o=>{
            o.unselect()
        })
        this.selection=[]
    }
    setTextureLoader(textureLoader){
        this.textureLoader=textureLoader
    }
    
    /**
     * @param {Object[]} Ant_Specie_classes Classes des especes requises par exemple {@link Ant_Messor} ...
     */
    async loadGlbAndTextures(Ant_Specie_classes){
        let prom=[]
        for(let i=0; i<Ant_Specie_classes.length;i++){
            prom.push(await this.loadGlb(Ant_Specie_classes[i]))
            prom.push(await this.loadTextures(Ant_Specie_classes[i]))
        }
        return await Promise.all(prom)
    }
    /**
     * @param {Object} Ant_Specie_class Classe de l'espece de fourmi voulue par exemple {@link Ant_Messor} ...
     */
    async loadGlb(Ant_Specie_class){
        return new Promise(resolve=>{
            this.GltfLoader.load( Ant_Specie_class.glb ,_glb=>{
                Ant_Specie_class.setGlbFile(_glb)
                debug && console.log("os.glb= ",_glb)
                resolve(true)
            })
        })
    }
    /**
     * @param {Object} O_Class Classe de l'objet voulue par exemple {@link Ant_Messor} ...
     */
    async loadTextures(O_Class){
        debug&&console.log("load Texture",O_Class)
        return new Promise(resolve=>{
            let prom=[]
            O_Class.textures.forEach( texture=>{
                prom.push( new Promise(resolve=>{
                    console.log("load Texture url=",texture.url,this.textureLoader)

                    this.textureLoader.load(texture.url, (_texture)=>{
                        console.log("loaded Texture ",texture)
                        _texture.encoding = THREE.sRGBEncoding
                        _texture.flipY = false
                        texture._texture=_texture
                        console.warn(texture,"Texture "+texture.url+ " loaded")
                        resolve (true)
                    },undefined,err=>{
                        console.error(err);
                    })
                }))
            })
            Promise.allSettled(prom).then(e=>{
                debug&&console.log("Textures toutes chargees")
                    resolve(true)
            })
        })
    }

    addTarget(){
        //only Ants for the moment
    }

    setTarget(){}

    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    setPanel(parent){
        const folder=parent.addFolder(this.constructor.name)
        // folder.open();
        folder.add(this,"visible").onChange(e=>{
            this.t.forEach(o => {
                console.log(o)
                o.obj.visible=e
            })
        })
         folder.add(this,"castShadow").onChange(e=>{
            this.t.forEach(o => {
                o.obj.setCastShadow(e)
            })
        })
        folder.add(this,"receiveShadow").onChange(e=>{
            this.t.forEach(o => {
                o.setReceiveShadow(e)
            })
        })

        this.t.forEach(o => {
            if(folder.__folders[o.obj.name])
                return
            let fo=folder.addFolder(o.obj.name);
            let fpos=fo.addFolder('position')
                fpos.add(o.obj.position,"x",-5,5,.0001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
                fpos.add(o.obj.position,"y",-5,5,.0001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
                fpos.add(o.obj.position,"z",-5,5,.0001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
            let frot=fo.addFolder('rotaion')
                frot.add(o.obj.rotation,"x",-5,5,.001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
                frot.add(o.obj.rotation,"y",-5,5,.001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
                frot.add(o.obj.rotation,"z",-5,5,.001).listen().onChange(e=>{
                    if(this.getGame().transport && !this.getGame().transport.isPlaying())  
                        this.getGame().cameras.render()
                })
            let fmat=fo.addFolder('Material');
                let col={color: '#'+o.obj.material.color.getHexString()}//light.color.toJSON()}
                fmat.addColor(col,"color").onChange(val => {o.obj.material.color.set(val)});
                fmat.add(o.obj.material,"precision",[ null,'lowp', 'mediump', 'highp' ]).onChange(e=>{o.needsUpdate=true});
                fmat.add(o.obj.material,"dithering",1,50,.1).onChange(e=>{o.needsUpdate=true});
                fmat.add(o.obj.material,"emissiveIntensity",0,1,0.001).listen().onChange(e=>{o.needsUpdate=true});
                if(o.obj.material.roughness){
                    fmat.add(o.obj.material,"roughness",0,1,0.001).listen().onChange(e=>{o.needsUpdate=true});
                    fmat.add(o.obj.material,"metalness",0,1,0.001).listen().onChange(e=>{o.needsUpdate=true});
                }
                if(o.obj.material.shininess){
                    fmat.add(o.obj.material,"shininess",0,50,0.1).onChange(e=>{o.needsUpdate=true});
                }
                    
                if(o.obj.material.clearcoat){
                    fmat.add(o.obj.material,"clearcoat",0,1,0.001).onChange(e=>{o.needsUpdate=true});
                    fmat.add(o.obj.material,"clearcoatRoughness",0,1,0.001).onChange(e=>{o.needsUpdate=true});
                }
        })

        return folder
    }
}