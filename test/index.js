describe("First set", function () {
    it("should work", function(){
        expect(true).toEqual(true);
    })

    it("creates object A", () => {
        var a = new A()
        expect(a instanceof A).toBe(true)
    })
    it("return X", () => {
        var a = new A()
        expect(a.getX()).toBe(1)
    })
    it("b overrides", () => {
        var b = new B()
        expect(b instanceof A).toBe(true)
        expect(b.getX()).toBe(18)
    })
})