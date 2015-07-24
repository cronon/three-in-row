class Matrix {
    constructor(width, height, defaultCb=function(){} ) {
        this.width = width;
        this.height = height;
        this.array = newArray(height).map((y) => {
            newArray(width).map((x) => defaultCb(x,y))
        })
    }
    get(x,y) {
        return this.array[y][x]
    }
}