import * as THREE from 'three';
import { StateMachine } from './stateMachine.js';
import { Etat } from './etats/etat.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
const debug=false
const fakeObj=new THREE.Object3D()
const raycaster = new THREE.Raycaster();
const downward = new THREE.Vector3(0, -1, 0); // Direction of the ray (downward)
const forward=new THREE.Vector3(1, 0, 0)
const HALF_PI=Math.PI / 2
const UP = new THREE.Vector3(0, 1, 0);

export class O{
    static specie="O"
    static _glb
    static textures=[];

    static setGlbFile(_glb){
        this._glb=_glb
    }
    // static getLineWidth(){
    //     return this.selectLineWidth
    // }
    // INSTANCE
    scene;
    obj;
    os
    rayon=.1
    scale=1
    textureLoader;
    name;
    selected;
    color=0xaaaaaaa
    meshes=[]
    /**
     * @var {StateMachine} mae
     */
    mae;//machine a etat
    arrowHelpers=[]
    onReached(){}
    forward =new THREE.Vector3(1, 0, 0)
    constructor(scene,os){
        this.scene=scene
        this.name=O.specie;
        this.os=os
        // console.log("New O "+this.getName())
    }
    
    setName(name){
        this.name=name
    }
    getName(){
        return this.name
    }

    getPosition(){
        return this.obj.position
    }

    getRadiusScaled(){
        return this.rayon*this.scale
    }
    setPosition(x,y,z){
        this.obj.position.set(x,y+this.getRadiusScaled(),z)
        this.position=new THREE.Vector3(x,y,z)
        // console.warn("o setpos "+this.getName() +"  : "+ this.obj.position.y);

    }
    setRotation(x,y,z){
        this.obj.rotation.set(x,y,z)
    }
    getScale(){
        return this.scale
    }

    setOs(os){
        this.os=os
    }
    getColor(){
        return this.color
    }
    setScale(value){
        this.scale=value
        this.obj.scale.set(value,value,value)
    }
    setTextureLoader(textureLoader){
        this.textureLoader=textureLoader
    }
    
    getSelectLineWidth(){
        return 1
    }
    getDirection(){
        return Math.atan2(this.obj.rotation.x, this.obj.rotation.z)
    }
    getGame(){
        return this.os.getGame()
    }
    buildSelectionObj(){
        debug && console.log("o.buildSelectionObj",this)
        const lineWidth=this.getSelectLineWidth()
        let r=this.rayon*this.scale*.4

        if( lineWidth===1){
            let g = new THREE.BufferGeometry().setFromPoints(
                new THREE.Path().absarc(0, 0, r, 0, Math.PI * 2).getSpacedPoints(32)
            );
            let m = new THREE.LineBasicMaterial({color: this.getColor()});
            this.selectionObj = new THREE.Line(g, m);
        }
        else{
            const geometry = new THREE.RingGeometry( r-lineWidth/500, r+lineWidth/500, 24, 1 ); 
            const material = new THREE.MeshBasicMaterial( { color: this.getColor()} );
            this.selectionObj  = new THREE.Mesh( geometry, material ); 
        }
        
        this.selectionObj.rotation.x-=Math.PI/2
        this.selectionObj.position.set(0,0.0001,0);
        this.obj.add(this.selectionObj)
    }
   
    getYFromXZ(origin){ /**unused because ground is doing it very well */
        raycaster.set(origin, downward);
        let intersects = raycaster.intersectObject(this.obj); // Perform raycasting
    
        if (intersects.length > 0) {
            return intersects[0].point.y;
        } else {
            console.warn("0 intersection found with plane!");
        }
    }
    


    followSlope(){
        
        const direction=this.getDirection()

        const normAndTan=this.getGame().ground.getNormalAndTangent(this.obj.position.x,this.obj.position.z)
        const groundNormal = normAndTan.normal
        // const groundTangent = normAndTan.tangent

        groundNormal.applyAxisAngle(forward, HALF_PI);
        
        fakeObj.position.copy(this.obj.position);
        let normal = new THREE.Vector3().copy(this.obj.position).add(groundNormal);

        fakeObj.lookAt(normal);
        // fakeObj.lookAt(groundNormal);
        // Extract the current Euler angles from fakeObj.rotation
        const currentRotation = new THREE.Euler().setFromQuaternion(fakeObj.quaternion, 'XYZ');

        // const direction=this.getDirection()
            // Apply the y-axis rotation while preserving x and z-axis rotations
            // const newYRotation = Math.atan2(this.velocity.x, this.velocity.z);
        fakeObj.rotation.set(currentRotation.x, direction, currentRotation.z);
        this.obj.rotation.copy(fakeObj.rotation);
    }

    
    
    setMAE(specie_class){
        this.mae=new StateMachine(specie_class,this)
    }
    /**
     * 
     * @param {Etat} state 
     */
    userSetState(state){
        this.mae.userSetState(state)
    }
    getState(){
        return this.mae.getState()
    }

    select(){
        if(this.selectionObj===undefined)
            this.buildSelectionObj()
        this.selectionObj.visible= this.selected =true
        
        
    }

    unselect(){
        if(this.selected){
            this.selectionObj.visible=this.selected=false
        }
    }
    /**
     * loads a texture and assigns it to obj.uv; flips texture Y for blender models
     * @param {string} uv map,bumpMap,uvNormal...
     * @param {string} url 
     * @param {*} obj 
     */
    assignTexture(material,uv="map",texture,options){
        // console.log("Assigning texture "+uv+" from ",texture,material)
        material[uv]=texture;
        for (let option in options){
            material[option]=options[option]
        }
        material.needsUpdate = true;
    }

    cloneGltf(gltf){
        let ng={};
        ng.scene=clone(gltf.scene)
        return ng
    }

    /**
     * @param {Object} 
     * @param {String} 
     * @param {Number} 
     */
    addArrows(o,v3="position",length=.5){
        this.vArrow=v3
        this.oArrow=o
        this.arrowHelpers=[
            new THREE.ArrowHelper( new THREE.Vector3(1,0,0),this.oArrow[this.vArrow], length, 0xff0000 ),
            new THREE.ArrowHelper( new THREE.Vector3(0,1,0),this.oArrow[this.vArrow], length, 0x00ff00 ),
            new THREE.ArrowHelper( new THREE.Vector3(0,0,1),this.oArrow[this.vArrow], length, 0x0000ff )
        ]
        for(const arrow of this.arrowHelpers)
            this.obj.add( arrow );
            // this.scene.add( arrow );
    }

    updateArrows(){
        // for(const arrow of this.arrowHelpers){
        //     // arrow.setDirection(this.dir)
        //     arrow.position.copy(this.oArrow[this.vArrow])
        // }
    }

    setGltf(gltf,numChild=0){
        // console.log("setGltf o",gltf,numChild)
        this.gltf=gltf
        this.rootObject=gltf.scene//=gltf.scene.clone()
        this.scene.add(this.rootObject)
        this.obj=gltf.scene.children[numChild]//=gltf.scene.children[0]//.clone()
        
        for(let i=gltf.scene.children.length-1;i>=0;i--){
            if(gltf.scene.children[i]!==this.obj){
                gltf.scene.children.splice(i,1)
            }
        }
        this.obj.traverse((child)=> {
            if(child.isMesh){
                debug && console.log("new o Mesh" ,child) 
                this.meshes.push(child) 
                
            }
        })
        // this.addBox3Helper()
        return this
    }
    /**
     * 
     * @returns 
     */
    getMeshes(){
        return this.meshes
    }
    setCastShadow(value=true){
        this.rootObject.castShadow=value;
        this.rootObject.traverse( function( node ) {
            if ( node.isMesh){
                node.castShadow = value; 
            }
        });
    }

    setReceiveShadow(value=true){
        this.rootObject.receiveShadow=value;
        this.rootObject.traverse( function( node ) {
            if ( node.isMesh){
                node.receiveShadow = value; 
            }
        });
    }

    tick(delta){
        this.mae && this.mae.tick(delta)
    }
}