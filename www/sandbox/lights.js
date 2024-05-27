import * as THREE from 'three';
export class Lights{
    static tLights=[];
    static add(light,scene){
        // console.log({"Type de lumière":light.type,"Nom d'objet":light.name,"obj":light})

        // const geometry = new THREE.CircleGeometry( 0.2, 12 ); 
        // const material = new THREE.MeshBasicMaterial( { 
        //     color: 0xffff00,
        //     side:THREE.DoubleSide,
        //     wireframe:true
        //  } ); 
        // let circle=new THREE.Mesh( geometry, material )
        // light.circle=circle
        // circle.position.set(light.position.x,light.position.y,light.position.z);
        // circle.visible=false
        // scene.add( circle );

        // circle.rotation.set(light.rotation.x,light.rotation.y,light.rotation.z);
        // circle.needsUpdate=true;
        // light.userData.attach(circle);
        this.tLights.push(light)
        scene&&scene.add( light );
    }

    static setPosition(numLight,x,z){
        this.tLights[numLight].position.x=x
        this.tLights[numLight].position.z=z
    }

    static shutOn(numLight){
        this.tLights[numLight].visible=true
    }
    static shutOff(numLight){
        this.tLights[numLight].visible=false
    }

    static randomRot(){
        this.tLights.forEach(light=>{
            // light.circle.rotation.x+=0.1;
            // light.circle.rotation.y-=0.1;
            // light.circle.rotation.z+=0.01;
        })
       

    }
    

    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    static setPanel(parent){
        this.tLights.forEach(light=>{
            const fLight=parent.addFolder("[Lumière]" + light.name)
            fLight.add(light,"name")
            let switcher={
                on_off:true
            }
            fLight.add(switcher,"on_off").onChange(e=>{
                light.visible=e
            })
            let fpos=fLight.addFolder('Position')
                fpos.add(light.position,"x",-5,5,.01)
                fpos.add(light.position,"y",-5,5,.01)
                fpos.add(light.position,"z",-5,5,.01)
            if(light.rotation){
                let frot=fLight.addFolder('Rotation')
                frot.add(light.rotation,"x",-5,5,.01)
                frot.add(light.rotation,"y",-5,5,.01)
                frot.add(light.rotation,"z",-5,5,.01)
            }
            
            let col={color: '#'+light.color.getHexString()}//light.color.toJSON()}
            fLight.addColor(col,"color").onChange(val => {light.color.set(val)});
            fLight.add(light,"intensity",0,5,.01)
            
            if(light.distance)
                fLight.add(light,"distance",0,5,.01)
            if(light.decay)
                fLight.add(light,"decay",0,5,.01)
            if(light.shadow){
                
                let fshadowCam=fLight.addFolder('Shadow options')
                fshadowCam.add(light,"castShadow")
                fshadowCam.add(light.shadow,"blurSamples",{low:4,medium:8,good:16,high:24})
                if(light.userData.shadowmapResolution){
                    fshadowCam.add(light.userData,"shadowmapResolution",[256,512,1024,2048]).onChange(e=>{
                        light.shadow.mapSize.set(e,e)
                    })
                }
                
                fshadowCam.add(light.shadow,"bias",0,0.1,0.0001)
                fshadowCam.add(light.shadow.camera,"near",0,2,0.001)
                fshadowCam.add(light.shadow.camera,"far",0.0001,5,0.001)
                // if(light.shadow.camera.focus)
                //     fshadowCam.add(light.shadow.camera,"focus",0,5,.1)
            }
        })
    }
}