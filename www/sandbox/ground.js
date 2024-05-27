
import { createNoise2D } from "./simplex-noise/simplex-noise.js";
import * as THREE from 'three';
const planeNormal = new THREE.Vector3(0, 1, 0)
const chunkTotSize=200
export class Ground{
    //use_wireframe=true//false;
    width
    height
    chunkSize=12/chunkTotSize
    geometry
    material
    position
    yFreq=0.04
    constructor(scene,width,height,gridHelper=false){
        this.width=width
        this.height=height
        this.material=new THREE.MeshPhongMaterial({color:0xfffffff,dithering:true,wireframe:this.use_wireframe})
        this.geometry=new THREE.PlaneGeometry(width,height,chunkTotSize,chunkTotSize)
        // this.widthSegments = this.geometry.parameters.widthSegments;
        // this.heightSegments = this.geometry.parameters.heightSegments;
        this.geometry.rotateX(-Math.PI/2)

        this.position=this.geometry.getAttribute("position")
        this.noise=createNoise2D()
        for (let i=0;i<this.position.count;i++){
            const x=this.position.getX(i)
            const z=this.position.getZ(i)
            if(x===0 && z===0)
                console.log(i)
            const y=this.noise(x,z)
            this.position.setY(i,y*this.yFreq)
        }
        this.geometry.computeVertexNormals()
        this.geometry.computeTangents()//computeFaceNormals();
        this.position.needsUpdate=true
        this.geometry.getAttribute("tangent").needsUpdate = true
        this.tangent=this.geometry.getAttribute("tangent")
        this.normal=this.geometry.getAttribute("normal")

        this.obj=new THREE.Mesh(
            this.geometry,
            this.material
        )
        if(gridHelper)
            this.obj.add(this.getGridHelper())
        // this.obj.rotation.x-=Math.PI/2;
        this.obj.receiveShadow=true;
        scene.add(this.obj)
        console.log("Ground new",this.obj);
        // this.addShapes(100000)
    }

    /**
     * @returns {THREE.Object3D}
     */
    getObject(){
        return this.obj
    }
    // getIndexFromUV(u, v) {
    //     let uIndex = Math.round((u+6) * (this.chunkSize-1));
    //     let vIndex = Math.round((v+6) * (this.chunkSize-1));
    //     return vIndex * this.chunkSize + uIndex;
    // }
    getIndexFromUV(x, z) {
        
        // Calculate UV coordinates
        const u = (x + this.width / 2) / this.width;
        const v = (z + this.height / 2) / this.height;

        // Calculate widthSegments and heightSegments
        const widthSegments = Math.ceil(this.width / this.chunkSize);
        const heightSegments = Math.ceil(this.height / this.chunkSize);

        // Calculate index
        const uIndex = Math.floor(u * widthSegments);
        const vIndex = Math.floor(v * heightSegments);

        // Calculate vertex index
        return vIndex * (widthSegments + 1) + uIndex;
    }

    getNormalAndTangent(u,v) {
        const i=this.getIndexFromUV(u,v)
        let normal = new THREE.Vector3(this.normal.getX(i),this.normal.getY(i),this.normal.getZ(i));
        let tangent = new THREE.Vector3(this.tangent.getX(i),this.tangent.getY(i),this.tangent.getZ(i));
        // console.log(normal)
        
        return { normal: normal, tangent: tangent };
    }

    getYFromXZ(x,z){
        return this.noise(x,z)*this.yFreq
    }

    getPlane(){
        return this.obj
    }  
    getGridHelper(){
        const size = 10;
        const divisions = 100;
        const gridHelper = new THREE.GridHelper( size, divisions );
        gridHelper.rotation.x-=Math.PI/2;
        gridHelper.position.y=0.0001
        return  gridHelper;
    }
    getPlane(){
        return this.obj
    }

    addShapes(NB){
        let geometry = new THREE.CylinderGeometry(0, .0035, .022, 3, 1);
        let material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });

        let mesh = new THREE.InstancedMesh( geometry, material, NB );
        this.scene.add( mesh );

        let dummy = new THREE.Object3D();

        for (let i = 0; i < NB; i++) {
            dummy.position.x = (Math.random() - 0.5) * 6;
            dummy.position.y = 0;//(Math.random() - 0.5) * 10;
            dummy.position.z = (Math.random() - 0.5) * 6

            dummy.updateMatrix();

            mesh.setMatrixAt( i ++, dummy.matrix );
            mesh.se
        }
    }
}