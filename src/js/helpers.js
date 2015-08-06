function newArray(size){
    return Array.apply(null, Array(size))
}

function timeout(ms, cb){
  // karma-babel doesn't want to know it
  window.Promise = window.Promise || _.noop
  let p = new Promise((res, rej) => {
    setTimeout(() => {
      cb()
      res()
    }, ms)
  })
  return p
}
