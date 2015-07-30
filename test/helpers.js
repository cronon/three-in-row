describe("Helpres",() => {
  describe("newArray(size,cb)",()=>{
    it("creates array of specified length", () => {
      let a = newArray(10)
      expect(a.length).toEqual(10)
    })
    it('contains pointers to different undefineds', ()=>{
      let a = newArray(3).map((_,i) => i)
      expect(a).toEqual([0,1,2])
    })
  })
  
})