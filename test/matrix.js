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
})