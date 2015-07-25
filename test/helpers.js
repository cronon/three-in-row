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
  describe("findGroups(matrix,cmp)", () => {
    it("finds horizontal row", () => {
      let m = Matrix.fromArray([[0,0,0],[1,0,1]])
      let actual = findGroups(m)
      expect([[0,0,0]]).toEqual(actual)
    })
    it("finds vertical row", () => {
      let m = Matrix.fromArray([[1,0],[1,1],[1,0]])
      let actual = findGroups(m)
      expect([[1,1,1]]).toEqual(actual)
    })
    it("find three or more in a row", () => {
      let m = Matrix.fromArray([
          [1,1,1,1,1],
          [1,1,1,1,0],
          [0,0,2,0,0]
        ])
      let actual = findGroups(m)
      expect([[1,1,1,1,1],[1,1,1,1]]).toEqual(actual)
    })
    it("finds several rows", () => {
      let m = Matrix.fromArray([
          [1,1,1],
          [0,2,0],
          [1,1,1]
        ])
      let actual = findGroups(m)
      expect([[1,1,1],[1,1,1]]).toEqual(actual)
    })
    it("finds vertical and horizontal rows", () => {
      let m = Matrix.fromArray([
          [1,1,1,0,1],
          [0,2,1,0,0],
          [1,0,1,1,0]
        ])
      let actual = findGroups(m)
      expect([[1,1,1],[1,1,1]]).toEqual(actual)
    })
    it("returns the same objects", ()=> {
      let o = new Object()
      let m = Matrix.fromArray([
          [o,o,o],
          [1,2,3]
        ])
      let groups = findGroups(m)
      expect(groups[0][0]).toBe(o)
    })
    it("accepts predicate", () => {
      let m = Matrix.fromArray([
          [2,4,6,1],
          [1,3,5,7]
        ])
      let actual = findGroups(m, (x,y) => x%2 == y%2)
      expect([[2,4,6],[1,3,5,7]]).toEqual(actual)
    })
  })
})