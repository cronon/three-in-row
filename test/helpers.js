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

  xdescribe("timeout(f, ms)", () => {
    it("returns a promise", () => {
      let t = timeout(0, () => {})
      expect(t.done).toEqual(jasmine.any(Function))
    })

    it("resolves after ms", () => {
      let start = Date.now(), end
      timeout(1000, () => {
          end = Date.now()
        })
        .done(() => {
          expect(end - start).toBeCloseTo(1000,-1)
          done()
          console.log(start)
        })
    })
  })
})