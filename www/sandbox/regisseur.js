import * as THREE from 'three';
import {Lights} from './lights.js'
import { O } from './o.js';

export class Regisseur{
    tObjetsSelected=[]
    tObjetsHighlighted=[]
    highlight

    constructor(scene){
        this.scene=scene
        this.scene.fog = new THREE.Fog( 0x000000, 4.9, 5.7 );
    }
    init2Lights(){
        const hlight=new THREE.HemisphereLight(
            0xebffeb, // bright sky color
            'darkslategrey', // dim ground color
            .85)//0.74 //FFF2DA
        hlight.name="Hemi0"
        Lights.add(hlight,this.scene)

        const light1=new THREE.DirectionalLight(0xffecca,4.5);//f0d1a5
        light1.name="DirectionalLight1"
        light1.position.set(.8,1.1,.8);
        light1.castShadow=true;
        light1.shadow.camera.near=0.01;
        light1.userData.shadowmapResolution=2048

        light1.shadow.mapSize=new THREE.Vector2(light1.userData.shadowmapResolution,light1.userData.shadowmapResolution)
        light1.shadow.camera.far=5;
        // light1.shadow.bias=-0.0005;
        // light1.shadow.focus=1;
        Lights.add(light1,this.scene)
    }

    init3Lights(){
        // const hlight=new THREE.AmbientLight(0xebffeb,0.56);//FFF2DA
        // const hlight=new THREE.AmbientLight(0xebffeb,1.1);//0.74 //FFF2DA
        const hlight=new THREE.HemisphereLight(
            'white', // bright sky color
            'darkslategrey', // dim ground color
            1.1)//0.74 //FFF2DA
        hlight.name="Ambiant0"
        hlight.position.set(0,1,0)
        Lights.add(hlight,this.scene)

        // const light0=new THREE.PointLight(0xf0f0f0,5,5,1.5);
        // light0.name="PointLight0"
        // light0.position.set(-1,2,.2);
        // light0.castShadow=true;
        // light0.shadow.camera.near=0.01;
        // light0.shadow.camera.far=5;
        // // light0.rotation.y+=Math.PI;
        // // light0.lookAt(new THREE.Vector3(0,0,0))
        // Lights.add(light0,this.scene)

        // const light1=new THREE.PointLight(0xfffffff,.7,2.2,2);
        const light1=new THREE.PointLight(0xffecca,4,1.45,1);//f0d1a5
        // const light1=new THREE.PointLight(0xffecca,2.2,4,0.65);//f0d1a5
        light1.name="PointLight1"
        light1.position.set(.02,1.1,.02);
        // light1.position.set(.02,.4,.02);
        light1.castShadow=true;
        light1.shadow.camera.near=0.01;
        light1.shadow.camera.far=5;
        // light1.shadow.bias=-0.0005;
        // light1.shadow.focus=1;
        Lights.add(light1,this.scene)
    }
    
    

    buildHighlight(){
        // this.highlight=new THREE.SpotLight(0xe1c9a8,0.39,0.51);
        // this.highlight=new THREE.SpotLight(0xe1c9a8,4,0.51);
        this.highlight=new THREE.SpotLight(0xe1c9a8,0.44,0.22);
        // this.highlight.position.set(.01,.1,.01);
        this.highlight.position.set(.001,.14,.04);
        this.highlight.decay=2.53//0.36
        this.highlight.castShadow=true;

        this.highlight.shadow.camera.near=0.1;
        this.highlight.shadow.camera.far=1;
        this.highlight.visible=true
        Lights.add(this.highlight)
        return this.highlight
    }

    /**
     * @param {O} o Adds an object to highlight
     */
    addObjHighlighted(o,name="Poursuite "+(this.tObjetsHighlighted.length+1)){
        let hlight=!this.highlight?this.buildHighlight():this.highlight.clone()
        this.tObjetsHighlighted.push(hlight)
        hlight.name=name
        hlight.target=o.obj
        o.obj.add(hlight)
    }

    /**
     * @param {O} o Adds an object to the selection
     */
    addObjSelected(o){
        this.tObjetsSelected.push(o)
    }

    unselectObj(){
        this.tObjetsSelected=[]
    }


    /**
     * 
     * @param {dat.GUI} parent 
     * @returns 
     */
    setPanel(parent){
        const fAnt=parent.addFolder('Régie lumière')
        fAnt.add(this.scene.fog,"near",0,5,0.001)
        fAnt.add(this.scene.fog,"far",0.0001,10,0.001)
        let col={color: '#'+this.scene.fog.color.getHexString()}//light.color.toJSON()}
        fAnt.addColor(col,"color").onChange(val => {this.scene.fog.color.set(val)});
        Lights.setPanel(fAnt)
    }
    // tick(){
        
    // }
}