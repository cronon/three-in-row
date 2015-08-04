class BoardView extends Backbone.View {
    constructor(options){
        super(options)
        this.$el = $('#board')
        this.template = window.Templates.board
    }
    render () {
        this.$el.empty().append(this.template())
        this.model.matrix.foldl((memo, gem) => {
            let gemView = new GemView({model: gem})
            this.$el.append(gemView.render().el)
        })
        return this
    }
}