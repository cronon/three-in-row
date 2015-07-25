function Matrix (width, height, defaultCb=function(){} ) {
    var array = newArray(height).map((_, y) => {
            return newArray(width).map((_, x) => defaultCb({x,y}) )
        })
    var m = function (x,y,newValue) {
        if (x > width - 1){
            throw Error(`x ${x} out of range`)
        }
        if (y > height + 1){
            throw Error(`y ${y} is out of range`)
        }
        if (arguments.length == 2) {
            return array[y][x]
        } else if (arguments.length == 3) {
            return array[y][x] = newValue
        } else {
            throw Error(`Arguments not supported ${arguments}`)
        }
    }
    m.width = width
    m.height = height
    m.foldl = function(f, initialValue){
        let memo = initialValue
        array.forEach((row, y) => {
            row.forEach((item, x) => {
                memo = f(memo, item, {x,y})
            })
        })
        return memo
    }

    m.toArray = function(){
        return array.map(row => row.slice())
    }

    m.map = function(f){
        return new Matrix(this.width, this.height, ({x,y}) => {
            return f(m(x,y), {x,y})
        })
    }

    m.clone = function(){
        return Matrix.fromArray(m.toArray())
    }
    return m
}
Matrix.fromArray = function(array){
    let height = array.length
    let width = array[0].length
    return new Matrix(width, height, ({x,y}) => {
        return array[y][x]
    })
}