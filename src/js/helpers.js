function newArray(size){
  return Array.apply(null, Array(size))
}

function findGroups(m, cmp=(x,y)=> x==y) {
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