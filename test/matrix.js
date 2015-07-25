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
})