import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//Un groupe de cameras qui ont un renderer commun
const VECTOR_UP=new THREE.Vector3(0, 1, 0)
const DEFAULT_ROTATION_LERP_FACTOR=0.2
const KEYS_NUMBERS=[
    ["&"],
    ["é"],
    ["\""],
    ["'"],
    ["("],
    ["-"],
    ["è"],
    ["_"],
    ["ç"],
    ["à"],
]
export class Cameras{//creates also a renderer
    tCameras=[]
    renderer;
    activeCam;
    lookedObj
    isLookingAt=false
    fovlerp;
    constructor(game,domParent=document.body,width=window.innerWidth,height=window.innerHeight){
        this.game=game
        this.domParent=domParent;
        this.width=width;
        this.height=height
        // console.log("Cameras.New renderer")
        this.renderer = new THREE.WebGLRenderer({
            antialias:true,
            precision:"highp",
            alpha: true
        });

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height );
        this.renderer.shadowMap.enabled=true;
        this.renderer.shadowMap.autoUpdate = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.localClippingEnabled = false;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;

        this.renderer.gammaFactor = 2.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.domParent.appendChild( this.renderer.domElement );
        window.addEventListener("resize",()=>{this.onWindowResize()});
        window.addEventListener("keydown",e=>{
            if(e.shiftKey || e.ctrlKey)
                return;
            const lowKey=e.key.toLowerCase()
            for (let i=0;i< KEYS_NUMBERS.length;i++){
                if(KEYS_NUMBERS[i].includes(lowKey)){
                    if(this.tCameras.length>i){
                        this.setActiveCam(this.tCameras[i])
                        
                    }
                    if(i===3)
                        e.preventDefault()

                    if(!this.game.transport.isPlaying())  
                        this.render()
                    break;

                }
            }
        })
    }

    setScene(scene){
        this.scene=scene
    }

    addCamera(camera){
        this.tCameras.push(camera)
        // console.log("Cameras.addCamera",camera)
        return this
    }
    getCamera(numCamera){
        return this.tCameras[numCamera]
    }
    setActiveCam(camera){
        if(camera!==this.activeCam){
            camera.userData.enableLookObj && this.lookedObj && camera.lookAt(this.lookedObj.position)
            // camera.userData.enableLookObj && this.lookedObj && camera.userData.controls.target(this.lookedObj) //camera.lookAt(this.lookedObj.position)
            this.activeCam=camera
        }
    }
    getActiveCam(){
        return this.activeCam
    }
    /**
     * If true, raycast on environment must be done with intersect on objects because of the perspective.
     * @returns {true|undefined}
     */
    getCamRaycastMode(){
        return this.activeCam.userData.raycastMode
    }

    addOrbitedCamera(camera){
        camera.userData.controls = new OrbitControls(camera,this.renderer.domElement);
        // camera.userData.controls.enableDamping=true
        // camera.userData.controls.dampingFactor=.1
        // controls.addEventListener("change",funcAnimate);
        this.addCamera(camera)
        // this.setActiveCam(camera)
        return this
    }

    getAngle(){

    }

    setLookAt(camera,enableLookAt=true){
        camera.userData.enableLookObj=enableLookAt
        camera.userData.lerpFactor=DEFAULT_ROTATION_LERP_FACTOR
    }

    
    setFov(value,delay=500){
        const now=performance.now()
        this.fovlerp={
            camera:this.activeCam,
            fovStart:this.activeCam.fov,
            fovEnd:value,
            deltaStart:now,
            deltaEnd:now+delay
        }
    }
    setDefaultCameras(){
        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.05, 4.3 );
        camera.position.z = .5;
        camera.position.y = 0.08;//0.075;
        this.setLookAt(camera)
        this.addOrbitedCamera(camera)
        camera.lookAt(0,0.4,0)
        camera.userData.raycastMode=true
        camera.userData.controls.minPolarAngle=camera.userData.controls.maxPolarAngle=1.45//Math.PI/2
        // const helper = new THREE.CameraHelper( camera );
        // this.scene.add( helper );
        // this.setActiveCam(camera)

        const camera1 = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 4.3 );
        camera1.position.z = .2;
        camera1.position.y = 1.3;
        this.setLookAt(camera1)
        this.addOrbitedCamera(camera1)

        const camera2=new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 5.4 );
        camera2.position.y = 2.5;
        this.setLookAt(camera2,false)
        camera2.lookAt(0,0,0)
        this.addOrbitedCamera(camera2)

        const camera3=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 3.8, 6 );
        camera3.position.y = 4.5;
        this.setLookAt(camera3,false)
        camera3.lookAt(0,0,0)
        this.addCamera(camera3)

        const camera4 = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.05, 4.3 );
        camera4.position.z = .5;
        camera4.position.y = 0.04;//0.075;
        camera4.rotation.x=-0.07
        this.setLookAt(camera4,false)
        // camera4.lookAt(0,0.4,0)
        this.addCamera(camera4)
        camera4.userData.raycastMode=true
        this.setActiveCam(camera4)
    }
    
    lookAt(obj){
        if(obj){
            this.lookedObj=obj
            this.isLookingAt=true
        }
        else{
            this.lookedObj=undefined
            this.isLookingAt=false
        }
    }
    togglelookedObj(){
        this.isLookingAt=!this.isLookingAt
        if(this.lookedObj===undefined){
            console.warn("Cameras : aucun objet actif à suivre!")
            this.isLookingAt=false
        }

    }

    attachCameraToObject(object,numCamera){
        object.add(this.tCameras[numCamera])
    }


    onWindowResize() {
        this.width=window.innerWidth
        this.height=window.innerHeight
        this.tCameras.forEach(camera=>{
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
            this.renderer.setSize( this.width, this.height );
        })
        if(this.game.transport && !this.game.transport.isPlaying())  
            this.render()
    }

    

    updateSmoothFov(){
        const now=performance.now()
        if( this.fovlerp.deltaEnd>now){
            const totaltime=this.fovlerp.deltaEnd-this.fovlerp.deltaStart
            const fov=THREE.MathUtils.lerp(this.fovlerp.fovStart,this.fovlerp.fovEnd,(now-this.fovlerp.deltaStart)/totaltime)
            this.fovlerp.camera.fov=fov
        }
        else{
            this.fovlerp.camera.fov=this.fovlerp.fovEnd
            this.fovlerp=undefined
        }
        // this.activeCam.updateProjectionMatrix()
    }

    render(delta){
        this.fovlerp && this.updateSmoothFov()
        
        if(this.isLookingAt && this.activeCam.userData.enableLookObj){
            if(this.activeCam.userData.enableLookObj){
                if(this.activeCam.userData.lerpFactor>0.01){
                    let q=getQuaternion(this.activeCam.position,this.lookedObj.position)
                    this.activeCam.quaternion.slerp(q,this.activeCam.userData.lerpFactor)
                }
                else
                    this.activeCam.lookAt(this.lookedObj.position);//.clone().setY(0.02)
            }
        }
        // this.activeCam.userData.controls&&this.activeCam.userData.controls.update(delta)
        this.activeCam.updateProjectionMatrix ()
        this.renderer.render( this.scene, this.activeCam );

    }

    setCameraPanel(){

    }

    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    setPanel(parent){
        const fCams=parent.addFolder('Caméras ( 1 : caméra1, 2 : caméra2, ...)')
        // let ctrl=fCams.add(this,"isLookingAt")
        this.tCameras.forEach((cam,i)=>{
            const fCam=fCams.addFolder('Caméra ' + (i+1))
            
            let fpos=fCam.addFolder('position')
                fpos.add(cam.position,"x",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
                fpos.add(cam.position,"y",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
                fpos.add(cam.position,"z",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
            let frot=fCam.addFolder('rotation')
                frot.add(cam.rotation,"x",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
                frot.add(cam.rotation,"y",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
                frot.add(cam.rotation,"z",-5,5,.01).listen().onChange(e=>{
                    if(this.game.transport && !this.game.transport.isPlaying())  
                        this.render()
                })
                frot.add(cam.userData,"enableLookObj")
                cam.userData.lerpFactor&&frot.add(cam.userData,"lerpFactor",0,1,0.005)
            let fovCtrl={fov:cam.fov}
            fCam.add(fovCtrl,"fov",0,180,.1).onChange(e=>{
                // if(this.fovlerp===undefined){
                    let now=performance.now()
                    this.fovlerp={
                        camera:cam,
                        fovStart:cam.fov,
                        fovEnd:e,
                        deltaStart:now,
                        deltaEnd:now+500
                    }
                }
            )
            fCam.add(cam,"zoom",0.01,5,.01).onChange(e=>{
                cam.updateProjectionMatrix()
            })
            fCam.add(cam,"near",0.01,3,.1).onChange(e=>{
                cam.updateProjectionMatrix()
            })
            fCam.add(cam,"far",0.01,10,.1).onChange(e=>{
                cam.updateProjectionMatrix()
            })
            if(cam.userData.controls){
                fCam.add(cam.userData.controls,"minPolarAngle",-2*Math.PI,2*Math.PI,0.01)
                fCam.add(cam.userData.controls,"maxPolarAngle",-2*Math.PI,2*Math.PI,0.01)
                fCam.add(cam.userData.controls,"minAzimuthAngle",-2*Math.PI,2*Math.PI,0.01)
                fCam.add(cam.userData.controls,"maxAzimuthAngle",-2*Math.PI,2*Math.PI,0.01)
            }

            // ctrl.onChange(e=>{
            //     console.log(e)
            //     this.togglelookedObj()
            //     ctrl.updateDisplay()
            // })
            // console.log(ctrl)
            // ctrl.name="Suivre"

        })
    }
}


function getQuaternion(cameraPosition, targetPosition) {
    // Calculate the direction vector from camera to target
    const direction = new THREE.Vector3().subVectors(targetPosition, cameraPosition).normalize();

    // Create a rotation matrix that aligns the camera's forward direction with the direction vector
    const matrix = new THREE.Matrix4().lookAt(cameraPosition, targetPosition, VECTOR_UP);

    // Extract the quaternion from the rotation matrix
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);

    // Return the quaternion representing the rotation
    return quaternion;
}

// function getObjectQuaternionTowardsTargetNoX(objectPosition,objectRotation, targetPosition) {
//      // Calculate the direction vector from object to target
//      const direction = new THREE.Vector3().subVectors(objectPosition, targetPosition).normalize();

//      // Extract the object's existing rotation around the y-axis
//     //  const existingRotation = new THREE.Euler().setFromQuaternion(object.quaternion, 'YXZ');
//      const existingYRotation = objectRotation.z;
 
//      // Calculate the angle between the direction vector and the positive z-axis
//      const angle = Math.atan2(direction.x, direction.y);
 
//      // Create a quaternion with rotation only around the y-axis
//      const quaternion = new THREE.Quaternion();
//      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle + existingYRotation);
 
//      // Return the quaternion representing the rotation
//      return quaternion;
// }
// function getObjectQuaternionTowardsTarget(objectPosition, targetPosition) {
//     // Calculate the direction vector from object to target
//     const direction = new THREE.Vector3().subVectors(objectPosition,targetPosition).normalize();
//     const quaternion = new THREE.Quaternion().setFromUnitVectors(
//         new THREE.Vector3(0, 0, 1), 
//         direction
//     );
//     quaternion.z= 0
//     quaternion.normalize()

//     return quaternion
// }
