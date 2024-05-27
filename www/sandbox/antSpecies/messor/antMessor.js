import {Ant} from '../../ant.js'
import * as THREE from 'three';

const debug=false

export class Ant_Messor extends Ant{
    static subFamily="Myrmicinae"
    static genus="Messor"
    static specie="M. Arenarius"
    static description="Les fourmis du Genre Messor sont aussi appelées les fourmis moissonneuses ou boulangères : elles récoltent des graines qu'elles transforment en pain assimilable. Pour cela, elles coupent les graines en morceaux puis les léchent longuement, les mastiquent et les imprégnent de salive (la mastication à lieue la tête en bas). La salive prédigère les graines sous l'effet des enzymes qu'elle contient."
    static trophallaxie = false
    static boulangere=true
    static glb="sandbox/antSpecies/messor/ant_rigged30.glb"
    static eyeMaterial=new THREE.MeshBasicMaterial({ color: 0x040404 })
    static textures=[
        {
            url:"sandbox/antSpecies/messor/antcolor uv diffuse14.png", type:"map",
            options:{
                dithering:true,
                flatShading : false,
                roughness:0.33,//0.26,//0.223,
                // metalness:0.006,//0.114,//0.243,
                clearcoat:0.029,//0.03,
                clearcoatRoughness:0.49//0.341//0.13
            }
        },
        {url:"sandbox/antSpecies/messor/antcolor uv normal14.png", type:"normalMap"},
        {url:"sandbox/antSpecies/messor/antcolor uv roughness14.png", type:"bumpMap"},
    ];
    static actionsDefinitions={//non additive[0]=default
        "nonadditives":[
            {name:"walk",timeScale:15, loop:THREE.LoopRepeat},
            {name:"clean",timeScale:2.5, loop:THREE.LoopOnce},
            {name:"sleep",timeScale:2, loop:THREE.LoopOnce, clampWhenFinished:true},
            {name:"unsleep",timeScale:2, loop:THREE.LoopOnce},
            {name:"tyk1",timeScale:2.5, loop:THREE.LoopOnce},
            {name:"tyk2",timeScale:2, loop:THREE.LoopOnce},
            {name:"lay_down",timeScale:2, loop:THREE.LoopOnce, clampWhenFinished:true},
            {name:"to_rest",timeScale:2, loop:THREE.LoopOnce, clampWhenFinished:true},
            
        ],
        "additives": [
            {name:"mandible_open",timeScale:5, loop:THREE.LoopOnce, clampWhenFinished:true},
            {name:"mandible_grab_seed",timeScale:10, loop:THREE.LoopOnce, clampWhenFinished:true},
            {name:"charged",timeScale:20, loop:THREE.LoopOnce, clampWhenFinished:true},
            // {name:"tyk1.003", timeScale:5},
            // {name:"tyk1.004", timeScale:5},
            // {name:"tyk1.005", timeScale:5}
        ]
    }
    static num=1


    //INSTANCE
    constructor(scene,Role_class){
        super(scene,Role_class);
        this.setName(Ant.specie+" "+ Ant_Messor.num++)
        console.log(this)
    }

    setGltf(gltf){
        debug&&console.log("setGltf antmessor",gltf)
        super.setGltf(this.cloneGltf(gltf))
        debug&&console.log({"Type d'Objet":this.obj.type,"Nom d'objet":this.obj.name},this.obj)
        this.antmesh= this.obj.children[0].children[0].children[0].children[0]
        this.eyemesh= this.obj.children[0].children[0].children[0].children[1]
        this.eyemesh.material=this.constructor.eyeMaterial
        debug&&console.log(this.antmesh,"antmesh",{"Type de Mesh":this.antmesh.type,"Nom d'objet":this.antmesh.name})
        this.antmesh.material.color=null
        Ant_Messor.textures.forEach(texture=>{
            this.assignTexture( this.antmesh.material,texture.type,texture._texture,texture.options?texture.options:{});
        })
    }
}