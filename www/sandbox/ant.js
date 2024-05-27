import * as THREE from 'three';
import { AnimatedO } from './animetedO.js';
import { Inactive } from './etats/inactive.js';
import { Dormir } from './etats/dormir.js';
import { Explore } from './etats/explore.js';
import { Va } from './etats/va.js';
import { Tik } from './etats/tik.js';
import { Nettoyage } from './etats/nettoyage.js';
import { Rentre } from './etats/rentre.js';
import { Role} from './ants_roles/role.js';
import { Reine } from './ants_roles/reine.js';
import { Ouvriere } from './ants_roles/ouvriere.js';
import { Os } from './os.js';
import { CheckPoint } from './checkpoint.js';
import { Fourmiliere } from './fourmiliere/fourmiliere.js';
// const v0=new THREE.Vector3(0,0,0)
const debug=false
const fakeObj=new THREE.Object3D()
const raycaster = new THREE.Raycaster();
const UP = new THREE.Vector3(0, 1, 0);

export class Ant extends AnimatedO{
    static specie="Ant"
    // static etats_possibles=[
    //     Inactive,
    //     Dormir,
    //     Explore,
    //     Va,
    //     Tik,
    //     Nettoyage,
    //     Rentre
    // ]
    static i=1
    
    textures=[];
    rayon=.09
    _ants;
    target
    skelet
    head
    /** @var {CheckPoint|Fourmiliere} base */ 
    base
    subFamily;
    genus;
    role_class;
    nbActions=0
    currentAction
    velocity=new THREE.Vector3(0,0,0)
    acceleration=new THREE.Vector3(0,0,0)

    view_radius=5
    minSpeed=-0.001;
    maxSpeed=0.0045;
    ratioDirection=.0004//0.0013
    ratioRandomDirection=.1//.21 pour fourmi debutante
    ratioAcceleration=0.0007651
    ratioRandomAcceleration=.5
    
    // perceptionRadius=0.150//cf ants
    
    desired=new THREE.Vector3(0,0,0)
    ratioSteering=.12
    steering=new THREE.Vector3(0,0,0)
    ratioActionTimeScale=862277//143983//862277//3572390//1 446 066//21691//RAF depend du framerate
    ratioRotationLerp=0.046//0.28//0.167
    ratioDecceleration=0.18//0.08 //a augmenter pour simuler la fatigue
    ratioFollowingTarget=.02
    distDetectTarget=.313;
    steeringNearTarget=3.63
    
    ratioTik=.001
    ratioDirtyTik=0
    stepDirtyTik=.5
    // MIN_SPEED=new THREE.Vector3(.00001,.00001,.00001)

    steeringSeparation=new THREE.Vector3()
    /**
     * @param {*} scene 
     * @param {Object} Role_class Classe du role de la fourmi voulue {@link Role} ...
     * @returns {Ant}
     */
    constructor(scene,Role_class){
        super(scene)
        this.role_class=Role_class
        this.setGltf(this.constructor._glb)//.then(()=>{
        this.obj.traverse(o=>{
            switch(o.name){
                case "Armature":
                    this.skelet=o
                    break
            }
        })
        this.skelet.traverse(o=>{
            if(o.name==="head")
                this.head=o
        })

        debug && console.log("squelette",this.skelet,this.head)
        this.setCastShadow(true)
        this.setMAE(this.constructor)
        this.mae.userSetState(Inactive)
        let scale=this.getScale()+(Math.random()-.5)/8
        // this.ratioActionTimeScale/=scale
        this.setScale(scale)
        // console.log(Role_class)
        // console.log(this.role_class.getetatsPossibles())
        debug&&console.log("new ant ",this)

    }

    getGame(){
        return this._ants.player.game
    }
    getSeparationFactor(){
        return this._ants.separationFactor
    }
    getScale(){
        return this.role_class.scale
    }

    /**
     * @returns {Role}
     */
    getRole(){
        return this.role_class
    }

    getGranary(){
        return this._ants.getGranary()
    }

    getColor(){
        if(this.role_class)
            return this.role_class.color
        else
            return super.getColor()
    }
    getSelectLineWidth(){
        if(this.role_class)
            return this.role_class.selectLineWidth
        else
            return super.getColor()
    }

    getDirection(){
        return Math.atan2(this.velocity.x, this.velocity.z)
    }

    setAnts(_ants){
        this._ants=_ants
        this.setPerceptionRadius(this._ants.perceptionRadius*this.scale)
        super.os=this._ants

        // this.perceptionRadius=this._ants.perceptionRadius*this.scale//+(Math.random()-.5)/10
    }
    // getColony(){
    //     if (!this._ants.isColony()){
    //         console.warn("ants n'est pas une colonie pb a gerer");
    //         return this._ants.getColony()

    //     }
    //     return this._ants
    // }

    setPerceptionRadius(radius){
        this.perceptionRadius=radius//+(Math.random()-.5)*radius/10
    }

    /** @param {CheckPoint|Fourmiliere} base */
    setBase(base){
        this.base=base
    }
    /** @returns {CheckPoint|Fourmiliere} */
    getBase(){
        return this.base
    }
    
    /**
     * La fourmi transporte un objet
     * @param {O} o 
     */
    setTarget(o){
        this.target=o;
        debug&&console.warn("TARGET",this.target&&this.target.getPosition(),this.target);
    }
    getTarget(){
        return this.target
    }

    /**
     * La fourmi transporte un objet
     * @param {O} o 
     */
    setCharge(o){
        if(this.targetReached){
            this.head.add(o.obj)
            o.obj.position.set(o.constructor.chargedPosition.x,o.constructor.chargedPosition.y,o.constructor.chargedPosition.z)
            o.obj.rotation.set(o.constructor.chargedRotation.x,o.constructor.chargedRotation.y,o.constructor.chargedRotation.z)
            // o.obj.position.set(0,0.0308,-0.0161)
            // o.obj.rotation.set(0.3,-1.017,Math.PI/2)
    
            this.charge=o
            debug&&console.warn("CHARGE",this.charge,o.constructor.chargedRotation);
            this.targetReached=undefined
        }
        

    }

    uncharge(){
        if(!this.head.children[2]){
            console.error("Uncharge Error",this);
            this.charge=null
            return
        }
        let quat=new THREE.Quaternion()
        this.charge.obj.getWorldQuaternion(quat)
        this.charge.obj.getWorldPosition(this.charge.obj.position)
        this.charge.position.x=this.charge.obj.position.x
        this.charge.position.z=this.charge.obj.position.z

        // let plane=this.getGame().ground.getPlane()
        this.charge.position.y=this.getGame().ground.getYFromXZ(this.charge.obj.position.x,this.charge.obj.position.z)
        // this.charge.position.y=this.findYOnPlane(this.charge.obj.position,plane)
        this.charge.obj.position.y=this.charge.position.y+ this.charge.getLayDownOffSetY()
        this.charge.checkPoint=this.target
        this.target.addFood(this.charge)

        this.charge.setTransportedBy(null)

        let o=this.head.children[2].removeFromParent()
        this.scene.add(o)
        this.target.obj.attach(o)
        debug&&console.warn("uncharge",this.charge,this.charge.position,this.charge.obj.position);

        // o.position.y=0.0128
        // if(!this.charge.constructor.layDownRotation)
        o.setRotationFromQuaternion(quat.normalize())
        if(this.charge.constructor.layDownRotation)
            this.charge.obj.rotation.set(this.charge.constructor.layDownRotation.x,o.rotation.y,o.rotation.z)
        this.charge.obj.needsUpdate=true
        // o.rotation.set(-1.342,0.0126,0)
        this.charge=undefined
    }
    
    seek(){
        this.desired=this.target.getPosition().clone().sub(this.obj.position)
        // if(desired.x>this.maxSpeed||desired.z>this.maxSpeed)
        //     desired=desired.normalize().multiplyScalar(this.maxSpeed)
        this.desired=this.desired.clampLength(-0.001,this.maxSpeed)
        this.steering=this.desired.sub(this.velocity)
    }

    applyForce(force){
        this.acceleration.add(force)
    }

    targetAttraction(){
        if(this.target){
            // if(this.target.getPosition().y>0){
            //     console.error("! "+this.target.getPosition().y,this.target);
            // }
            this.distanceTarget=this.obj.position.distanceTo(this.target.getPosition())-this.rayon-this.target.rayon
            // console.log(this.target,this.distanceTarget)

            const ratioSteeringFromNearbyTarget=this.distanceTarget>this.distDetectTarget?
                this.ratioSteering:
                Math.min((1-Math.pow((this.distDetectTarget-this.distanceTarget)/this.distDetectTarget,3))*this.ratioSteering*this.steeringNearTarget,1)
            
            this.applyForce(this.steering.multiplyScalar(ratioSteeringFromNearbyTarget))
            this.steering.set(0,0,0)
        }
    }
    
    isWalking(){
        return this.currentAction && this.currentAction._clip.name==="walk"
    }
    /**
     * 
     * @param {Os[]} os 
     */
    separation(os,delta){
        let total=0
        for (let o of os){
            if(o!==this){
                let dist=Math.max(this.obj.position.distanceTo(o.obj.position)+this.rayon+o.rayon,0.00001)
                if(dist<this.perceptionRadius  ){
                    
                    // let dif=new THREE.Vector3().subVectors(this.obj.position,o.obj.position)
                    // dif.divideScalar(dist)
                    // this.steeringSeparation.add(dif)
                    let direction=new THREE.Vector3().subVectors(this.obj.position,o.obj.position)
                    this.steeringSeparation.add(direction.divideScalar(Math.pow(dist/(Math.max(this.perceptionRadius-this.rayon,0.001)),this.role_class!==Reine?this._ants.separationExpFactor:this._ants.separationExpFactor*20)))
                    total++
                }
            }
        }
        if(total>0){
            this.steeringSeparation.divideScalar(total)
            this.steeringSeparation.sub(this.velocity)
            this.steeringSeparation.multiplyScalar(this.getSeparationFactor()/delta).multiplyScalar(this.velocity.length())
            // this.steeringSeparation.clampLength(-this.maxSpeed*.75,this.maxSpeed*.75)
        }
    }

    setAnimationMixerSpeed(value){
        this.mixer.timeScale=value
    }

    update(delta){
        this.velocity=this.velocity.add(this.acceleration).clampLength(this.minSpeed,this.maxSpeed)//.multiplyScalar(delta*4000)
        // if(this.facc!==undefined)
        //     this.facc.updateDisplay()
        // if(this.fvel!==undefined)
        //     this.fvel.updateDisplay()

        const newPos=this.obj.position.clone().add(this.velocity)
        if(this.currentAction && this.currentAction._clip.name==="walk"){
            // this.applyForce(this.steeringSeparation)
            let dist=this.obj.position.distanceTo(newPos)
            this.currentAction.setEffectiveTimeScale(dist*this.ratioActionTimeScale/this.scale*delta)
            //rotation lerp
            fakeObj.position.set(this.obj.position.x,this.obj.position.y,this.obj.position.z)
            fakeObj.rotation.set(this.obj.rotation.x,this.obj.rotation.y,this.obj.rotation.z)
            fakeObj.lookAt(newPos);
            this.obj.quaternion.slerp(fakeObj.quaternion,this.ratioRotationLerp*delta/1000)
            this.obj.quaternion.normalize()
            // let newquat=this.obj.quaternion.clone().slerp(fakeObj.quaternion,this.ratioRotationLerp)
            // this.obj.setRotationFromQuaternion(newquat)
        }
            
        // this.obj.lookAt(newPosLerped); //without rotation lerp
        // this.obj.position.set(newPos.x,0,newPos.z)
        
        this.obj.position.set(newPos.x,this.getGame().ground.getYFromXZ(newPos.x,newPos.z),newPos.z)
        super.followSlope()

        this.acceleration.multiplyScalar(Math.sqrt(1-this.ratioDecceleration))
    }
    followSlope(nextPos){
        const currentPos = this.obj.position.clone();
        const forward = this.forward.clone();
      
        // Move ant forward
        // const nextPos = currentPos.add(forward.multiplyScalar(speed));
      
        // Cast a ray from the next position in the direction of the forward vector
       
        raycaster.set(nextPos, forward.clone().normalize());
      
        // Check for intersections with the rock
        const intersects = raycaster.intersectObject(this.getGame().ground.obj, true);
        let i=0,intersect
        while(i<intersects.length ){
            if(intersects[i].object && intersects[i].object.type==="Mesh" ){
                intersect = intersects[i]
                break
            }
            else
                i++
        }
        if(intersect){
        // if (intersects.length > 0) {
        //   const intersect = intersects[0];
      
          // Ensure the intersected object has a valid face
        //   if (intersect.face) {
            const point = intersect.point;
            const normal = intersect.face.normal;
      
            // Position the ant at the intersection point
            this.obj.position.copy(point);
            if( intersect.face){
                // Align the ant's orientation with the surface normal
                const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, normal);
                this.obj.quaternion.copy(quaternion);
        
                // Adjust the ant's forward vector to stay on the plane of the new polygon
                const newForward = forward.clone().applyQuaternion(quaternion);
                this.forward = newForward.projectOnPlane(normal).normalize();
            //   }
            }
            
        }
        else{
            // console.warn("!");
            this.obj.position.copy(nextPos);
            super.followSlope()
        }




        // this.obj.position.set(newPos.x,this.getGame().ground.getYFromXZ(newPos.x,newPos.z),newPos.z)
        
        // const normAndTan=this.getGame().ground.getNormalAndTangent(this.obj.position.x,this.obj.position.z)
        // const groundNormal = normAndTan.normal
        // // const groundTangent = normAndTan.tangent
        // groundNormal.applyAxisAngle(forward, HALF_PI);
        
        // fakeObj.position.copy(this.obj.position);
        // let normal = new THREE.Vector3().copy(this.obj.position).add(groundNormal);

        // fakeObj.lookAt(normal);
        // // fakeObj.lookAt(groundNormal);
        // // Extract the current Euler angles from fakeObj.rotation
        // const currentRotation = new THREE.Euler().setFromQuaternion(fakeObj.quaternion, 'XYZ');

        // // const direction=this.getDirection()
        //     // Apply the y-axis rotation while preserving x and z-axis rotations
        //     // const newYRotation = Math.atan2(this.velocity.x, this.velocity.z);
        // fakeObj.rotation.set(currentRotation.x, direction, currentRotation.z);
        // this.obj.rotation.copy(fakeObj.rotation);
    }
    // update(delta){
    //     this.velocity=this.velocity.add(this.acceleration).clampLength(this.minSpeed,this.maxSpeed)
    //     const forward = this.forward.clone();
    //     const currentPos = this.obj.position.clone();

    //     const newPos=this.obj.position.clone().add(this.velocity)
    //     // const nextPos = currentPos.add(forward.multiplyScalar(speed));

    //     // Cast a ray from the next position in the direction of the forward vector
    //     raycaster.set(newPos, forward.clone().normalize());

    //     // Check for intersections with the rock
    //     const intersects = raycaster.intersectObject(this.getGame().ground.obj, true);
        
    //     if (intersects.length > 0) {
    //         let i=0,intersect
    //         console.log(intersects);
    //         while(i<intersects.length ){
    //             if(intersects[i].object && intersects[i].object.type==="Mesh" ){
    //                 intersect = intersects[i]
    //                 console.log("f",i);

    //                 break
    //             }
    //             else
    //                 i++
    //         }
    //         console.log(i);
    //         if(intersect){
    //             console.log("ok");

    //             // const intersect = intersects[i];
                
    //         // if (intersect.face) {
    //             const point = intersect.point;
    //             const normal = intersect.face.normal;

    //             // Position the ant at the intersection point
    //             this.obj.position.copy(point);

    //             // Align the ant's orientation with the surface normal
    //             const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, normal);
    //             this.obj.quaternion.copy(quaternion);

    //             // Adjust the ant's forward vector to stay on the plane of the new polygon
    //             const newForward = forward.clone().applyQuaternion(quaternion);
    //             this.forward = newForward.projectOnPlane(normal).normalize();
    //         }
    //         else{
    //             this.obj.position.copy(newPos);
    //         }
    //     }
    // }

    
    
    isTargetReached(){
        if(this.target){
            if(this.distanceTarget<this.distDetectTarget){
                this.velocity.clampLength(0,this.maxSpeed*.8)
                // console.log("reach distance : "+this.distanceTarget);
                if(this.distanceTarget<=this.target.rayon*1.1){ //this.distDetectTarget*.25
                    // debug&&console.log("found target")
                    this.target.onReached(this)
                    return true
                }
                else
                    this.acceleration.multiplyScalar((1-this.ratioDecceleration)*0.6)
            }
        }
        return false
    }

    

    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    setPanel(parent){
        const fAnt=parent.addFolder(this.name)
        fAnt.open();
        fAnt.add(this,"name")
        fAnt.add(this.obj,"visible")
        // fAnt.add(this,"followingTarget").listen()

        // const fState=fAnt.addFolder("Etat")
        // fState.open()
        // this.inputEtat="inactive"
        
        // let stateNames=Ant.etats_possibles.map(e=>e.nom)
        // let stateNames={}
        
        // for(let etat of Ant.etats_possibles){
        //     stateNames[etat.libelle]=etat.nom

        // }

        // this.iinputEtat=fState.add(this,"inputEtat",stateNames)
        // this.iinputEtat.onChange(e=>{
        //     // this.$inputEtat.updateDisplay()
        //     for(let etat of Ant.etats_possibles){
        //         if(etat.nom===e ){
        //             console.log("Nouvel etat:"+etat.name)

        //             this.setState(etat)
        //             break;
        //         }
        //     }
        // })

        // fAnt.add(this.mae,"etats_en_cours")
        fAnt.add(this,"ratioTik",0,.01,.0001)

        const fMove=fAnt.addFolder("Reglages Déplacements")

        fMove.add(this,"minSpeed",0,.01,.0001)
        fMove.add(this,"maxSpeed",0,.01,.0001)

        fMove.add(this,"ratioActionTimeScale",1,4000000,1)
        fMove.add(this,"ratioRotationLerp",0,1,.001)
        fMove.add(this,"ratioRandomDirection",0,0.5,0.01)
        
        fMove.add(this,"ratioDirection",0,0.005,0.0001)
        fMove.add(this,"ratioRandomAcceleration",0,1,0.01)

        fMove.add(this,"ratioAcceleration",0,this.maxSpeed/2,this.maxSpeed/100)
        fMove.add(this,"ratioDecceleration",0,1,0.01)
        
        fMove.add(this,"ratioFollowingTarget",0,1,.001)
        fMove.add(this,"ratioSteering",0,1,.001)
        fMove.add(this,"distDetectTarget",0.001,0.5,.001)
        fMove.add(this,"steeringNearTarget",3,5,.01)

        

        let fpos=fAnt.addFolder('position')
            fpos.add(this.obj.position,"x",-5,5,.01).listen()
            fpos.add(this.obj.position,"y",-5,5,.01).listen()
            fpos.add(this.obj.position,"z",-5,5,.01).listen()
        let frot=fAnt.addFolder('rotation')
            frot.add(this.obj.rotation,"x",-5,5,.01).listen()
            frot.add(this.obj.rotation,"y",-5,5,.01).listen()
            frot.add(this.obj.rotation,"z",-5,5,.01).listen()
        this.fvel=fAnt.addFolder('velocity');
            this.fvel.add(this.velocity,"x",-0.0025,.0025,.0001)
            this.fvel.add(this.velocity,"y",-0.0025,.0025,.0001)
            this.fvel.add(this.velocity,"z",-0.0025,.0025,.0001)
        this.facc=fAnt.addFolder('acceleration');
            this.facc.add(this.acceleration,"x",-0.0025,.0025,.0001)
            this.facc.add(this.acceleration,"y",-0.0025,.0025,.0001)
            this.facc.add(this.acceleration,"z",-0.0025,.0025,.0001)
        this.fmat=fAnt.addFolder('Material');
            this.fmat.add(this.antmesh.material,"precision",[ null,'lowp', 'mediump', 'highp' ]).onChange(e=>{this.needsUpdate=true});
            this.fmat.add(this.antmesh.material,"dithering",1,50,.1).onChange(e=>{this.needsUpdate=true});
            this.fmat.add(this.antmesh.material,"roughness",0,1,0.001).onChange(e=>{this.needsUpdate=true});
            this.fmat.add(this.antmesh.material,"metalness",0,1,0.001).onChange(e=>{this.needsUpdate=true});
            this.fmat.add(this.antmesh.material,"clearcoat",0,1,0.001).onChange(e=>{this.needsUpdate=true});
            this.fmat.add(this.antmesh.material,"clearcoatRoughness",0,1,0.001).onChange(e=>{this.needsUpdate=true});
        // console.warn(this.antmesh.material)
        if(this.clips.length>0){
            super.setPanel(fAnt)
        }
        return fAnt
    }
}

