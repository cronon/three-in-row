$(() => {
    let gemSet = 'ruby emerald topaz sapphire amber amethyst diamond'.split(' ')
    let board = new Board(8,8, gemSet)
    let boardView = new BoardView({model: board})
    window.B = boardView
    boardView.render()
})