describe("Board", () => {
    it("creates", ()=>{
        let b = new Board(10,10)
        expect(b).toEqual(jasmine.any(Backbone.Model))
    })
    it('has width and height', () => {
        let b = new Board(10,5)
        expect(b.width).toEqual(10)
        expect(b.height).toEqual(5)
    })
    it('has matrix', () => {
        let m = (new Board(10,5)).matrix
        expect(m.width).toEqual(10)
        expect(m.height).toEqual(5)  
    })
    it('fills matrix with Gems', () => {
        let m = (new Board(10,5)).matrix
        let cells = m.foldl((memo, gem) => memo.concat(gem), [])
        cells.map(cell => {
            expect(cell).toEqual(jasmine.any(Gem))
        })
    })
    it('uses provided gemSet', () => {
        let b = new Board(2,1,['ruby'])
        let cells = b.matrix.foldl((memo, gem) => memo.concat(gem.get('kind')), [])
        expect(cells).toEqual(['ruby', 'ruby'])
    })

    describe("#step", () => {
        let arrayToGems = function(array){
            return Matrix.fromArray(array).map((kind, {x,y}) => new Gem({x,y,kind}))
        }
        it('does nothing when nothing to do', () => {
            let m = [['ruby','ruby','emerald'],['emerald','ruby','ruby']]
            let g = arrayToGems(m)
            let b = new Board(3,2,['ruby','emerald'])
            b.matrix = g.clone()
            b.step()
            expect(b.matrix).toEqual(g)
        })
    })
})