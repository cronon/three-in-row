class Board extends Backbone.Model {
    initialize(width, height, gemSet=['emerald','ruby','diamond','sapphire']) {
        this.width = width
        this.height = height
        this.gemSet = gemSet
        this.matrix = new Matrix(width, height, (x,y) => {
            return new Gem({
                x,
                y,
                kind: _.sample(gemSet)
            })
        })
    }
    step(){
        let columns = _.groupBy(this.removeGroups(), gem => gem.get('y'))
        console.log(columns)
        columns.forEach(y => this.slideColumn(y))
        let newGems = this.createNewGems()
        this.pasteNewGems(newGems)
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
    slideColumn(x, isGap = g => !g) {
        let m = this.matrix
        for(var i=0; i<m.height-1; i++){
            for(var j=0; j<m.height-1; j++){
                if(isGap(m(x,j))){
                    m.swap([x,j],[x,j+1])
                }
            }
        }
        m.map((gem,{x,y}) => {
            gem.set('x',x)
            gem.set('y',y)
        })
    }
    createNewGems(isGap = g => g.get('kind') == 'gap') {
        let m = this.matrix
        return m.foldl((memo, item, {x,y}) => {
            if(isGap(item)){
                return memo.concat(new Gem({
                    x: x,
                    y: y + m.height,
                    kind: _.sample(this.gemSet)
                }))
            } else {
                return memo
            }
        },[])
    }
}