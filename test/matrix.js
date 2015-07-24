describe("Matrix", () => {
    let m
    beforeEach(() =>{
        m = new Matrix(5,10, (x,y) => { return {x,y} })
    })
    it("creates", () => {
        expect(m instanceof Matrix).toBe(true)
    })

    it("has width", () => {
        expect(m.width).toEqual(5)
    })
    it("has height", () => {
        expect(m.height).toEqual(10)
    })
    it("has getter", () => {
        let cell = m.get(1,1)
        expect(cell).toBeDefined()
    })
    it("has setter", () => {
        m(1,1,12321)
        let cell = m.set(1,1)
        expect(cell).toEqual(12321)
    })
    it("accept function for default values", ()=>{
        let cell = m.get(1,1)
        expect(cell).toEqual({x: 1, y: 1})
    })
})