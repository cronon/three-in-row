//<reference path="Backbone.d.ts" />
import bb = require('backbone')
class A {
    x:number
    y:number[]
    constructor(){
        this.x = 1
        this.y = [1,2]
    }
    getX(){
        return this.x;
    }
}
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}
function f (x: number) : ((y: string) => any) {
    return (y: string) => y+x
}
var M = bb.Model;