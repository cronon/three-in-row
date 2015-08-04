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
                if(m(x,j).isGap()){
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
    createNewGems(columnsHeight) {
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
    pasteNewGems(columnsHeight, newGems) {
        let m = this.matrix
        newGems.forEach(gem => {
            let x = gem.get('x')
            let y = gem.get('y')-m.height+columnsHeight[x]
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
}