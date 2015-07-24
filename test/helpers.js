describe("Helpres",() => {
  describe("newArray(size,cb)",()=>{
    it("creates array of specified length", () => {
      let a = newArray(10)
      expect(a.length).toEqual(10)
    })
  })
})