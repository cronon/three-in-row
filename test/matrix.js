describe("Matrix", () => {
    let m
    beforeEach(() =>{
        m = new Matrix(5,10, (x,y) => ({x,y}))
    })
    it("creates", () => {
        expect(m instanceof Function).toBe(true)
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
        let m = new Matrix(5,10, (x,y) => ({x,y}) )
        let cell = m(1,1)
        expect(cell).toEqual({x: 1, y: 1})
    })
    it("has first argument for x and second for y", () => {
        let m = new Matrix(5,10, (x,y) => ({x,y}) )
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
            m = new Matrix(3,2, (x,y) => ({x, y}) )
        })
        it("has foldl method", () => {
            expect(m.foldl instanceof Function).toBe(true)
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
            expect(Matrix.fromArray instanceof Function).toBe(true)
        })
        it("creates a new matrix", () => {
            let m = Matrix.fromArray([[1,2],[3,4]])
            expect(m instanceof Function).toBe(true)
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
})