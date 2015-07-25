function Matrix (width, height, defaultCb=function(){} ) {
    var array = newArray(height).map((_, y) => {
            return newArray(width).map((_, x) => defaultCb(x,y) )
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
    return m
}