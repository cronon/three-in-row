window.onload = (() => {
    let boardView = new BoardView({})
    window.BV = boardView
    window.B = BV.model
    boardView.render()
})