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

    let arrayToGems = function(array){
        return Matrix.fromArray(array).map((kind, {x,y}) => new Gem({x,y,kind}))
    }
    describe("#removeGroups", () => {
        var b
        beforeEach(()=>{
            b = new Board(3,3,['ruby','emerald'])
        })
        it('does nothing when nothing to do', () => {
            let m = [['ruby','ruby','emerald'],
                     ['emerald','ruby','ruby'],
                     ['ruby','emerald','emerald']]
            let g = arrayToGems(m)
            b.matrix = g.clone()
            b.removeGroups()
            expect(b.matrix.toArray()).toEqual(g.toArray())
        })

        it('returns destroyed gems', () => {
            let b = new Board(3,1,['ruby','emerald'])
            let m = [['ruby','ruby','ruby']]
            let g = arrayToGems(m)
            b.matrix = g
            let [g0,g1,g2] = [g(0,0), g(1,0), g(2,0)]
            let [a0,a1,a2] = b.removeGroups()
            expect(a0).toBe(g0)
            expect(a1).toBe(g1)
            expect(a2).toBe(g2)
        })
        it('destroys three in a horizontal row', () => {
            let m = [['ruby','ruby','ruby'],
                     ['emerald','ruby','emerald'],
                     ['ruby','emerald','ruby']]
            let g = arrayToGems(m)
            g.map((gem) => spyOn(gem, 'remove'))
            b.matrix = g
            b.removeGroups()                
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
            b.removeGroups()    
            _.range(3).forEach(i => {
                expect(b.matrix(0,i).remove).toHaveBeenCalled()
                expect(b.matrix(1,i).remove).not.toHaveBeenCalled()
                expect(b.matrix(2,i).remove).not.toHaveBeenCalled()
            })
        })
    })
    
    describe("#slideColumn(column, isGap)", () => {
        it("handle no gaps", () => {
            let b = new Board(1,3,['ruby','emerald'])
            let m = [['ruby'], ['emerald'], ['ruby']]
            let g = arrayToGems(m)
            b.matrix = g.clone()
            b.slideColumn(0)
            let actual = b.matrix.toArray()
            expect(actual).toEqual(g.toArray())
        })
        it("handle one gap", () => {
            let b = new Board(1,3,['ruby','emerald', 'gap'])
            let m = [['ruby'],['gap'],['emerald']]
            b.matrix = arrayToGems(m)
            b.slideColumn(0)
            let actual = b.matrix.map(g => g.get('kind')).toArray()
            expect(actual).toEqual([['ruby'],['emerald'],['gap']])
        })
        it("handle several gaps", () => {
            let b = new Board(1,3,['ruby','emerald', 'gap'])
            let m = [['ruby'],['gap'],['gap'],['emerald']]
            b.matrix = arrayToGems(m)
            b.slideColumn(0)
            let actual = b.matrix.map(g => g.get('kind')).toArray()
            expect(actual).toEqual([['ruby'],['emerald'],['gap'],['gap']])
        })
        it("updates gemset", () => {
            let b = new Board(1,3,['ruby','emerald', 'gap'])
            let m = [['gap'],['gap'],['emerald']]
            b.matrix = arrayToGems(m)
            let g0 = b.matrix(0,0)
            let g1 = b.matrix(0,1)
            let e2 = b.matrix(0,2)
            b.slideColumn(0)
            expect(g0.get('y')).toEqual(1)
            expect(g1.get('y')).toEqual(2)
            expect(e2.get('y')).toEqual(0)
        })
    })
    describe("#columnsHeight(isGap(gem))", () => {
        it("calculates height of columns", () => {
            let b = new Board(3,2,['ruby','emerald'])
            let m = [['emerald','ruby','gap'],
                     ['emerald','gap','gap']]
            b.matrix = arrayToGems(m)
            let heights = b.columnsHeight()
            expect(heights).toEqual([2,1,0])
        })
    })
    describe("#createNewGems(columsHeight, isGap(gem))", () => {
        it("creates new gems", () => {
            let b = new Board(3,1,['ruby','emerald'])
            let m = [['emerald','gap','gap']]
            b.matrix = arrayToGems(m)
            let [g1, g2] = b.createNewGems([1,0,0])
            expect(g1).toEqual(jasmine.any(Gem))
            expect(g2).toEqual(jasmine.any(Gem))
        })
        it("creates new gems with random kind", () => {
            let b = new Board(3,1,['ruby','emerald'])
            let m = [['emerald','gap','gap']]
            b.matrix = arrayToGems(m)
            let [g1, g2] = b.createNewGems([1,0,0])
            expect(['ruby','emerald']).toContain(g1.get('kind'))
            expect(['ruby','emerald']).toContain(g2.get('kind'))
        })
        it("creates new gems higher than board", () => {
            let b = new Board(1,3,['ruby','emerald'])
            let m = [['emerald'],['gap'],['gap']]
            b.matrix = arrayToGems(m)
            let [g1, g2] = b.createNewGems([1])
            expect(g1.get('y')).toEqual(3)
            expect(g2.get('y')).toEqual(4)
        })
    })
    describe("#pasteNewGems(columnsHeight, newGems)", () => {
        var b, m, g3, g4
        beforeEach(() => {
            b = new Board(1,3,['ruby','emerald'])
            m = [['emerald'],['gap'],['gap']]
            b.matrix = arrayToGems(m);
            [g3, g4]= [['emerald',0,3],['ruby',0,4]].map(([kind,x,y]) => {
                return new Gem({kind,x,y}) 
            })
            b.pasteNewGems([1], [g3,g4])
        })
        it("move gems on their new place",() => {
            expect(g3.get('y')).toEqual(1)
            expect(g4.get('y')).toEqual(2)
        })
        it("pastes new gems into matrix", () => {
            expect(b.matrix(0,1)).toBe(g3)
            expect(b.matrix(0,2)).toBe(g4)
        })
    })
    describe("#swap([x,y],[x,y])", () => {
        describe("impossible swap",() => {
            let b
            beforeEach(()=>{
                b = new Board(3,2,['ruby','emerald'])
                b.matrix = arrayToGems([
                    ['ruby','emerald','ruby'],
                    ['ruby','emerald','ruby'],
                    ])
            })
            it("returns false", () => {
                let result = b.swap([0,0],[0,1])
                expect(result).toEqual(false)
            })
            it("doesn't swap", () => {
                let g0 = b.matrix(0,0)
                let g1 = b.matrix(0,1)
                b.swap([0,0],[0,1])
                expect(g0.get('y')).toEqual(0)
                expect(g1.get('y')).toEqual(1)
            })
        })
        describe("possible swap", () => {
            let b
            beforeEach(()=>{
                b = new Board(3,2,['ruby','emerald'])
                b.matrix = arrayToGems([
                    ['ruby','emerald','ruby'],
                    ['emerald','ruby','ruby'],
                    ])
            })
            it("returns true", () => {
                let result = b.swap([1,0],[1,1])
                expect(result).toEqual(true)
            })
            it("swaps gems", () => {
                let g0 = b.matrix(1,0)
                let g1 = b.matrix(1,1)
                b.swap([1,0],[1,1])
                expect(g0).toBe(b.matrix(1,1))
                expect(g1).toBe(b.matrix(1,0))
            })
        })
        it("returns null when incorrect swap", () => {
            let b = new Board(3,3,['ruby','emerald'])
            let swap1 = () => b.swap([0,0],[1,1])
            let swap2 = () => b.swap([0,0],[0,2])
            let swap3 = () => b.swap([0,0],[0,0])
            expect(swap1()).toEqual(null)
            expect(swap2()).toEqual(null)
            expect(swap3()).toEqual(null)
        })
    })
    describe("#hasSwap", () => {
        it("finds specific horizontal swap", () => {
            let b = new Board(3,2,['r','e'])
            let m = arrayToGems([
                    ['r','e','r'],
                    ['e','r','r']
                ])
            let swap = {
                stones: [
                    {dx: 0, dy: 0},
                    {dx: 2, dy: 0}
                ],
                possibilities: [
                    {dx: 1, dy: 1},
                    {dx: 1, dy: -1}
                ]
            }
            b.matrix = m
            expect(b.hasSwap(swap)).toBe(true)
        })
        it("finds specific vertical swap", () => {
            let b = new Board(2,3,['r','e'])
            let m = arrayToGems([
                    ['r','e'],
                    ['e','r'],
                    ['r','r']
                ])
            let swap = {
                stones: [
                    {dx: 0, dy: 1},
                    {dx: 0, dy: 2}
                ],
                possibilities: [
                    {dx: -1, dy: 0},
                    {dx: 0, dy: -1},
                    {dx: 1, dy: 0},
                ]
            }
            b.matrix = m
            expect(b.hasSwap(swap)).toBe(true)
        })
        it("returns false when find nothing", () => {
            let b = new Board(2,3,['r','e'])
            let m = arrayToGems([
                    ['e','r'],
                    ['e','e'],
                    ['r','r']
                ])
            let swap = {
                stones: [
                    {dx: 0, dy: 0},
                    {dx: 0, dy: 1}
                ],
                possibilities: [
                    {dx: -1, dy: -1},
                    {dx: 0, dy: -2},
                    {dx: 1, dy: -1},
                ]
            }
            b.matrix = m
            expect(b.hasSwap(swap)).toBe(false)
        })
    })
    describe("#swapsPossibility", () => {
        let b
        beforeEach(() => {
            b = new Board(3,3,['0','1','2','3'])
        })
        describe("horizontal", () => {
            it(".XX", () => {
                let m = arrayToGems([
                    '011'.split(''),
                    '123'.split(''),
                    '031'.split(''),
                    ])
                b.matrix = m 
                expect(b.swapsPossibility()).toBe(true)
            })
            it("X.X", () => {
                let m = arrayToGems([
                    '101'.split(''),
                    '212'.split(''),
                    '301'.split(''),
                    ])
                b.matrix = m 
                expect(b.swapsPossibility()).toBe(true)
            })
        })
        describe("vertical", () => {
            it(".XX", () => {
                let m = arrayToGems([
                    '103'.split(''),
                    '021'.split(''),
                    '033'.split(''),
                    ])
                b.matrix = m 
                expect(b.swapsPossibility()).toBe(true)
            })
            it("X.X", () => {
                let m = arrayToGems([
                    '123'.split(''),
                    '013'.split(''),
                    '121'.split(''),
                    ])
                b.matrix = m 
                expect(b.swapsPossibility()).toBe(true)
            })
        })
        describe("none", () => {
            it('returns false', () => {
                let m = arrayToGems([
                        '123'.split(''),
                        '030'.split(''),
                        '121'.split(''),
                    ])
                b.matrix = m 
                expect(b.swapsPossibility()).toBe(false)
            })
        })
    })
})