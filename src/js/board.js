class Board extends Backbone.Model {
    initialize(width, height, gemSet=['emerald','ruby','diamond','sapphire']) {
        this.width = width
        this.height = height
        this.matrix = new Matrix(width, height, (x,y) => {
            return new Gem({
                x,
                y,
                kind: _.sample(gemSet)
            })
        })
    }
}