describe("Matrix", () => {
    let m
    beforeEach(() =>{
        m = new Matrix(5,10, ({x,y}) => ({x,y}))
    })
    it("creates", () => {
        expect(m).toEqual(jasmine.any(Function))
    })

    it("has width", () => {
        expect(m.width).toEqual(5)
    })
    it("has height", () => {
        expect(m.height).toEqual(10)
    })
    it("has getter", () => {
        let cell = m(1,1)
        expect(cell).toBeDefined()
    })
    it("has setter", () => {
        m(1,1,12321)
        let cell = m(1,1)
        expect(cell).toEqual(12321)
    })
    it("accept function for default values", ()=>{
        let m = new Matrix(5,10, ({x,y}) => ({x,y}) )
        let cell = m(1,1)
        expect(cell).toEqual({x: 1, y: 1})
    })
    it("has first argument for x and second for y", () => {
        let m = new Matrix(5,10, ({x,y}) => ({x,y}) )
        let cell = m(1,5)
        expect(cell).toEqual({x:1, y:5})
    })
    it("throws range error", ()=>{
        let m = new Matrix(2,3)
        let x = () => m(3,1)
        let y = () => m(1,5)
        expect(x).toThrowError(/x.*out of range/i)
        expect(y).toThrowError(/y.*out of range/i)
    })
    describe("#foldl( function(memo, item, {x, y}), startValue)", () => {
        let m;
        beforeEach(()=>{
            m = new Matrix(3,2, ({x,y}) => ({x, y}) )
        })
        it("has foldl method", () => {
            expect(m.foldl).toEqual(jasmine.any(Function))
        })
        it("iterates from left to right, up to down", () => {
            let xIndexes = m.foldl((memo, item) => memo.concat(item.x),[])
            let yIndexes = m.foldl((memo, item) => memo.concat(item.y),[])
            expect(xIndexes).toEqual([0,1,2,0,1,2])
            expect(yIndexes).toEqual([0,0,0,1,1,1])
        })
        it("provide x and y values", () => {
            let xIndexes = m.foldl((memo, item, {x,y}) => memo.concat(x),[])
            let yIndexes = m.foldl((memo, item, {x,y}) => memo.concat(y),[])
            expect(xIndexes).toEqual([0,1,2,0,1,2])
            expect(yIndexes).toEqual([0,0,0,1,1,1])
        })
    })
    describe("::fromArray([[any]])", ()=>{
        it("has fromArray method", () =>{
            expect(Matrix.fromArray).toEqual(jasmine.any(Function))
        })
        it("creates a new matrix", () => {
            let m = Matrix.fromArray([[1,2],[3,4]])
            expect(m).toEqual(jasmine.any(Function))
            expect(m(1,1)).toEqual(4)
            expect(m(1,0)).toEqual(2)
        })
    })
    describe("#toArray", () => {
        let m
        beforeEach(()=>{
            m = new Matrix(2,3, ({x,y}) => 1 )
        })
        it("returns correct array", () => {
            let a = m.toArray()
            expect(a).toEqual([[1,1],[1,1],[1,1]])
        })
        it('returns array which is independent from matrix', () => {
            let a = m.toArray()
            a[0][0] = 18
            expect(m(0,0)).not.toEqual(a[0][0])
        })
    })
    describe("#map( function(item, {x,y}) )", () => {
        let m
        beforeEach(()=>{
            m = new Matrix(1,2,({x,y}) => ({x,y}))
        })
        it("returns new matrix", () => {
            let m_ = m.map(i => i)
            expect(m_).not.toBe(m)
        })
        it("apply function to every item", () => {
            let m_ = m.map(i => i.y+2)
            expect(m_(0,0)).toEqual(2)
            expect(m_(0,1)).toEqual(3)
        })
        it("pass x and y into map function", () => {
            let m_ = m.map((i, {x,y}) => [x+1,y+7])
            expect(m_(0,0)).toEqual([1,7])
            expect(m_(0,1)).toEqual([1,8])
        })
    })
    describe("#clone", () => {
        let m, m_
        beforeEach(()=>{
            m = new Matrix(1,2,({x,y}) => ({x,y}))
            m_ = m.clone()
        })
        it("new matrix has the same properties", () => {
            expect(m_.toArray()).toEqual(m.toArray())
        })
        it("creates new instance", () => {
            m(0,0,0)
            m_(0,0,88)
            expect(m(0,0)).not.toEqual(m_(0,0)) 
        })
    })
    describe("#findGroups(cmp)", () => {
        it("finds horizontal row", () => {
          let m = Matrix.fromArray([[0,0,0],[1,0,1]])
          let actual = m.findGroups()
          expect([[0,0,0]]).toEqual(actual)
        })
        it("finds vertical row", () => {
          let m = Matrix.fromArray([[1,0],[1,1],[1,0]])
          let actual = m.findGroups()
          expect([[1,1,1]]).toEqual(actual)
        })
        it("find three or more in a row", () => {
          let m = Matrix.fromArray([
              [1,1,1,1,1],
              [1,1,1,1,0],
              [0,0,2,0,0]
            ])
          let actual = m.findGroups()
          expect([[1,1,1,1,1],[1,1,1,1]]).toEqual(actual)
        })
        it("finds several rows", () => {
          let m = Matrix.fromArray([
              [1,1,1],
              [0,2,0],
              [1,1,1]
            ])
          let actual = m.findGroups()
          expect([[1,1,1],[1,1,1]]).toEqual(actual)
        })
        it("finds vertical and horizontal rows", () => {
          let m = Matrix.fromArray([
              [1,1,1,0,1],
              [0,2,1,0,0],
              [1,0,1,1,0]
            ])
          let actual = m.findGroups()
          expect([[1,1,1],[1,1,1]]).toEqual(actual)
        })
        it("returns the same objects", ()=> {
          let o = new Object()
          let m = Matrix.fromArray([
              [o,o,o],
              [1,2,3]
            ])
          let groups = m.findGroups()
          expect(groups[0][0]).toBe(o)
        })
        it("accepts predicate", () => {
          let m = Matrix.fromArray([
              [2,4,6,1],
              [1,3,5,7]
            ])
          let actual = m.findGroups((x,y) => x%2 == y%2)
          expect([[2,4,6],[1,3,5,7]]).toEqual(actual)
        })
        it("returns empty array when nothing has been found", () => {
            let m = Matrix.fromArray([1,2,3,4])
            let actual = m.findGroups()
            expect(actual).toEqual([])
        })
    })

    describe("#swap([x1,y1],[x2,y2])", ()=>{
        it("swaps two cells", () => {
            let o1,o2
            let m = [[o1,o2]] = [[Object(), Object()]]
            m = Matrix.fromArray(m)
            m.swap([0,0],[1,0])
            let [[o2_, o1_]] = m.toArray()
            expect(o1_).toBe(o1)
            expect(o2_).toBe(o2)
        })
    })
})