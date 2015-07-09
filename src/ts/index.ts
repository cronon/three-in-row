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
console.log(a.getX())