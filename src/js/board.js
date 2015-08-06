class Board extends Backbone.Model {
    initialize(width, height, gemSet=['emerald','ruby','diamond','sapphire']) {
        this.width = width
        this.height = height
        this.gemSet = gemSet
        this.matrix = new Matrix(width, height, ({x,y}) => {
            return new Gem({
                x,
                y,
                kind: _.sample(gemSet)
            })
        })
    }
    step(){
        let columns = _.groupBy(this.removeGroups(), gem => gem.get('x'));
        _.keys(columns).forEach(x => this.slideColumn(x))
        let columnsHeight = this.columnsHeight()
        let newGems = this.createNewGems(columnsHeight)
        this.pasteNewGems(columnsHeight, newGems)
    }
    removeGroups(){
        let toRemove = this.matrix.findGroups((g1,g2) => {
            return g1.get('kind') == g2.get('kind')
        })
        toRemove = _.union.apply(null, toRemove)
        toRemove.forEach(gem => {
            gem.remove()
        })
        return toRemove
    }
    slideColumn(x) {
        let m = this.matrix
        for(var i=0; i<m.height-1; i++){
            for(var j=0; j<m.height-1; j++){
                if(m(x,j).isGap() && !m(x,j+1).isGap() ){
                    m.swap([x,j],[x,j+1])
                    m(x,j+1).set('y',j+1)
                    m(x,j).set('y',j)
                }
            }
        }
    }
    columnsHeight(){
        let m = this.matrix
        return _.range(m.width).reduce((memo,x) => {
            return memo.concat(_.range(m.height).reduce((memo,y)=> {
                if (m(x,y).isGap() && y < memo){
                    return y
                } else {
                    return memo
                }
            },m.height))
        },[])
    }
    createNewGems(columnsHeight = this.columnsHeight()) {
        let m = this.matrix
        return m.foldl((memo, item, {x,y}) => {
            if(item.isGap()){
                return memo.concat(new Gem({
                    x: x,
                    y: m.height + y - columnsHeight[x],
                    kind: _.sample(this.gemSet)
                }))
            } else {
                return memo
            }
        },[])
    }
    pasteNewGems(columnsHeight = this.columnsHeight(), newGems) {
        let m = this.matrix
        newGems.forEach(gem => {
            let x = gem.get('x')
            let y = gem.get('y')-m.height+columnsHeight[x]
            m(x, y).destroy()
            m(x, y, gem)
            gem.set('y',y)
        })
    }
    swap([x1,y1],[x2,y2]) {
        if(Math.abs(x1-x2) + Math.abs(y1-y2) != 1) {
            return null
        }
        let m = this.matrix
        m.swap([x1,y1],[x2,y2])
        let groups = m.findGroups((g1,g2) => {
            return g1.get('kind') == g2.get('kind')
        })
        if(groups.length == 0 ){
            m.swap([x1,y1],[x2,y2])
            return false
        } else {
            return true
        }
    }
    hasSwap({stones, possibilities}) {
        let m = this.matrix
        let sm = m.safe
        let result = false
        for( let y = 0; y < m.height; y++) {
            for(let x = 0; x < m.width; x++){
                let kinds = _.compact(stones.map(({dx, dy}) => {
                    return sm(x+dx, y+dy) && sm(x+dx, y+dy).get('kind')
                }))
                let pKinds = _.compact(possibilities.map( ({dx,dy}) => {
                    return sm(x+dx, y+dy) && sm(x+dx, y+dy).get('kind')
                }))
                result = result ||
                    kinds.length == stones.length && 
                    _.all(kinds, kind => kind == kinds[0]) && 
                    _.some(pKinds, kind => kind == kinds[0])
            }
        }
        return result
    }
    swapsPossibility() {
        let SWAPS = []
        // left horizontal .XX
        // SWAPS.push({
        //     stones: [
        //         {dx: 1, dy: 0},
        //         {dx: 2, dy: 0}
        //     ],
        //     possibilities: [
        //         {dx: 0, dy: 1},
        //         {dx: 0, dy: -1},
        //         {dx: -1, dy: 0},
        //     ]
        // })
        // horizontal .XX.
        SWAPS.push({
            stones: [
                {dx: 0, dy: 0},
                {dx: 1, dy: 0}
            ],
            possibilities: [
                {dx: 2, dy: 1},
                {dx: 2, dy: -1},
                {dx: 3, dy: 0},

                {dx: -2, dy: 0},
                {dx: -1, dy: 1},
                {dx: -1, dy: -1},
            ]
        })
        // center horizontal X.X
        SWAPS.push({
            stones: [
                {dx: 0, dy: 0},
                {dx: 2, dy: 0}
            ],
            possibilities: [
                {dx: 1, dy: 1},
                {dx: 1, dy: -1}
            ]
        })
        // top vertical .XX
        // SWAPS.push({
        //     stones: [
        //         {dx: 0, dy: 1},
        //         {dx: 0, dy: 2}
        //     ],
        //     possibilities: [
        //         {dx: 0, dy: -1},
        //         {dx: 1, dy: 0},
        //         {dx: -1, dy: 0},
        //     ]
        // })
        // vertical .XX.
        SWAPS.push({
            stones: [
                {dx: 0, dy: 0},
                {dx: 0, dy: 1}
            ],
            possibilities: [
                {dx: 0, dy: 3},
                {dx: 1, dy: 2},
                {dx: -1, dy: 2},

                {dx: 0, dy: -2},
                {dx: -1, dy: -1},
                {dx: 1, dy: -1},
            ]
        })
        // center vertical X.X
        SWAPS.push({
            stones: [
                {dx: 0, dy: 0},
                {dx: 0, dy: 2}
            ],
            possibilities: [
                {dx: 1, dy: 1},
                {dx: -1, dy: 1}
            ]
        })
        return _.any(SWAPS.map(s => this.hasSwap(s)))
    }
}