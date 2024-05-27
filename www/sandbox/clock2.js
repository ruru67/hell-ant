import {Clock} from 'three';

export class Clock2 extends Clock{
    pausing
    pause(){
        this.pausing=true
        // this.running = false;
    }
    continue(){
        this.pausing=false
        // this.running = true;
        let elapsedTime=this.getDelta()
        this.startTime += elapsedTime
        this.elapsedTime -= elapsedTime
    }
    moveForward(delta){
        // this.oldTime -= delta
        this.startTime -= delta
        // const newTime = this.oldTime;
        this.elapsedTime += delta
    }
}