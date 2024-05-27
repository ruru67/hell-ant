import * as THREE from 'three';


export class GeometryMaker{
    static cube(obj){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        obj.add( cube );
        return this.cube;
    }

    /** 
     * Adds a cross with radius r to object obj
     * @var {THREE.Object3D} obj
     * @var {THREE.Material} material
     * @returns {THREE.BufferGeometry} 
    */
    static cross(obj, r, material){
        const traits = [
            [
                new THREE.Vector3( -r, 0, -r ),
                new THREE.Vector3(  0, 0,  0)
            ],
            [
                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( r, 0, r )
            ],
            [
                new THREE.Vector3( r, 0.0001, -r ),
                new THREE.Vector3( 0, 0.0001,  0 )
            ],
            [
                new THREE.Vector3(  0, 0.0001, 0 ),
                new THREE.Vector3( -r, 0.0001, r )
            ],
        ];
        traits.forEach(trait=>{
            const geometry = new THREE.BufferGeometry().setFromPoints( trait );
            const line = new THREE.Line( geometry, material );
            obj.add(line)
        })
    }
}