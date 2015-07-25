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
        var b
        beforeEach(()=>{
            b = new Board(3,3,['ruby','emerald'])
        })
        it('does nothing when nothing to do', () => {
            let m = [['ruby','ruby','emerald'],['emerald','ruby','ruby'],['ruby','ruby','emerald']]
            let g = arrayToGems(m)
            b.matrix = g.clone()
            b.step()
            expect(b.matrix.toArray()).toEqual(g.toArray())
        })
        it('destroys three in a horizontal row', () => {
            let m = [['ruby','ruby','ruby'],
                     ['emerald','ruby','emerald'],
                     ['ruby','emerald','ruby']]
            let g = arrayToGems(m)
            g.map((gem) => spyOn(gem, 'remove'))
            b.matrix = g

            _.range(3).forEach(i => {
                expect(b.matrix(i,0).remove).toHaveBeenCalled()
                expect(b.matrix(i,1).remove).not.toHaveBeenCalled()
                expect(b.matrix(i,2).remove).not.toHaveBeenCalled()
            })
        })
        it('destroys three in a vertical row', () => {
            let m = [['ruby','emerald','ruby'],
                     ['ruby','ruby','emerald'],
                     ['ruby','emerald','ruby']]
            let g = arrayToGems(m)
            g.map((gem) => spyOn(gem, 'remove'))
            b.matrix = g

            _.range(3).forEach(i => {
                expect(b.matrix(0,i).remove).toHaveBeenCalled()
                expect(b.matrix(1,i).remove).not.toHaveBeenCalled()
                expect(b.matrix(2,i).remove).not.toHaveBeenCalled()
            })
        })
    })
})