describe("Gem", () => {
    it("creates", () => {
        let g = new Gem({x:1, y:1, kind: 'emerald'})
        expect(g).toEqual(jasmine.any(Gem))
    })
})