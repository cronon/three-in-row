class GemView extends Backbone.View {
    constructor(options) {
        super(options)
        this.$el.attr('tabindex',0)
        this.$el.html(''+this.model.get('x')+this.model.get('y'))
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'destroy', this.remove)
    }
    render () {
        let {x,y,kind} = this.model.attributes
        let classes = `col-${x} row-${y} ${kind} gem`
        this.$el.attr('class', classes)
            .attr('data-x',this.model.get('x'))
            .attr('data-y',this.model.get('y'))
        return this
    }
}