describe("Matrix", () => {
    var m
    beforeEach(() =>{
        m = new Matrix(5,10)
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
})