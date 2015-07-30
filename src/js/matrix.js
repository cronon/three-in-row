function Matrix (width, height, defaultCb=function(){} ) {
    var array = newArray(height).map((_, y) => {
            return newArray(width).map((_, x) => defaultCb({x,y}) )
        })
    var m = function (x,y,newValue) {
        if (x > width - 1){
            throw Error(`x ${x} out of range`)
        }
        if (y > height - 1){
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

    m.findGroups = function(cmp=(x,y)=> x==y) {
        let horizontalGroups = _.range(m.height).reduce((memo, y) => {
            let groupedRow = _.range(m.width).reduce((memo,x) => {
                if(x == 0){
                    return [[m(x,y)]]
                } else if (cmp(_.last(_.last(memo)), m(x,y))) {
                    memo[memo.length-1].push(m(x,y))
                } else {
                    memo.push([m(x,y)])
                }
                return memo
            },[])
            return memo.concat(groupedRow)
        },[])

        let verticalGroups = _.range(m.width).reduce((memo, x) => {
            let groupedRow = _.range(m.height).reduce((memo,y) => {
                if(y == 0){
                    return [[m(x,y)]]
                } else if (cmp(_.last(_.last(memo)), m(x,y))) {
                    memo[memo.length-1].push(m(x,y))
                } else {
                    memo.push([m(x,y)])
                }
                return memo
            },[])
            return memo.concat(groupedRow)
        },[])
        let groups = horizontalGroups.concat(verticalGroups)
        return _.filter(groups, (group) => {
            if (group.length > 2) {
                return true
            } else {
                return false
            }
        })
    }

    m.swap = function([x1,y1],[x2,y2]) {
        let temp = m(x1,y1)
        m(x1,y1, m(x2,y2))
        m(x2,y2, temp)
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