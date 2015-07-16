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

var a:A = new A()
interface F {
    (i:number[]): number;
}
var [b, ...c] = [1,2,3,4]
console.log(b,c)