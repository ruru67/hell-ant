import { O } from "../o.js";
import * as THREE from 'three';
import { Food } from "./food.js";

const debug=false

export class Graine extends Food{
    static subFamily="Végétaux"
    static genus="inconnu"
    static specie="Graine"
    static glb="sandbox/food/graine3.glb"
    // static glb="food/graine1e.glb"
    static num=1
    

    //INSTANCE
    
    constructor(scene,os){
        super(scene,os);
        
        this.rayon=this.constructor.rayon//014
        this.setName(Graine.specie+ Graine.num++)
        this.setGltf(this.constructor._glb)//.then(()=>{
        this.setCastShadow(true)
        this.obj.position.y=this.constructor.initialPosition.y
        this.obj.rotation.x=this.constructor.initialRotation.x
        this.obj.rotation.y=(Math.random()-.5)*Math.PI/20
        this.obj.rotation.z=(Math.random()-.5)*Math.PI
        debug&&console.log("Graine.new : ",this.name,this)
    }
   
    // setPosition(x,y,z){
    //     super.setPosition(x,y,z)
    //     this.position=new THREE.Vector3(x,y,z)
    // }
    
    setGltf(gltf){
        debug&&console.log("setGltf Graine",gltf)
        super.setGltf(this.cloneGltf(gltf),this.constructor.numChild)
        if(!this.constructor.material){
            this.constructor.material=this.obj.material.clone()
            this.constructor.textures.forEach(texture=>{
                // console.warn("graine.setGltf texture=",texture._texture)
                this.assignTexture( this.constructor.material,texture.type,texture._texture,texture.options?texture.options:{});
            })
        }
        this.obj.material=this.constructor.material
        // this.obj.material.map=this.constructor.textures[0]._texture
        // for (let option in this.constructor.textures[0].options){
        //     console.log(option+":",this.constructor.textures[0].options[option])
        //     this.obj.material[option]=this.constructor.textures[0].options[option]
        // }
        
        debug&&console.warn("__________",this.constructor)
        debug&&console.warn({"Type d'Objet":this.obj.type,"Nom d'objet":this.obj.name,"source":this.obj.material.map.source.data.src},this.obj)

    }

    
}

export class Graine1 extends Graine{
    static numChild=0
    static layDownOffSetY=0.0139
    static initialRotation={x:1.57}
    static initialPosition={y:0.0124}
    static chargedPosition={x:0,y:0.0308,z:-0.0161}
    static chargedRotation={x:0.3,y:-1.017,z:Math.PI/2}
    static rayon=0.0124//0.016
    static textures=[
        {
            url:"sandbox/food/graine_texture.png", type:"map",
            options:{
                dithering:true,
                flatShading : false,
                roughness:0.55,
                metalness:0,
            }
        },
    ];
}

export class Graine2 extends Graine{
    static numChild=1
    static layDownOffSetY=0.0102
    static rayon=0.0098//0.014
    static initialRotation={x:1.57}
    static initialPosition={y:0.0094}
    static chargedPosition={x:0,y:0.0298,z:-0.0161}
    static chargedRotation={x:1.57,y:1.57,z:0.071}
    static layDownRotation={x:1.87,y:0,z:-.6}
    static textures=[
        {
            url:"sandbox/food/graine2ac_texture.png", type:"map",
            options:{
                dithering:true,
                flatShading : false,
                roughness:0.35,
                metalness:0,
            }
        },
    ];
}

export class Graine3 extends Graine{
    static numChild=2
    static layDownOffSetY=0.0102
    static rayon=0.0077//0.014
    static initialRotation={x:1.57}
    static initialPosition={y:0.0094}
    // static chargedPosition={x:0,y:0.0298,z:-0.0161}
    // static chargedRotation={x:1.57,y:1.57,z:0.071}
    static chargedPosition={x:-0.0006,y:0.0356,z:-0.0128}
    static chargedRotation={x:-0.275,y:-3.933,z:-0.933}
    static layDownRotation={x:1.87,y:0,z:-.6}
    static textures=[
        {
            url:"sandbox/food/graine3bc3_texture.png", type:"map",
            options:{
                dithering:true,
                flatShading : false,
                roughness:0.52,
                metalness:0,
            }
        },
    ];
}