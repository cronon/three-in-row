class GemView extends Backbone.NativeView {
    constructor(options) {
        super(options)
        this.el.setAttribute('tabindex',0)
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'destroy', this.onDestroy)
    }
    render () {
        let {x,y,kind} = this.model.attributes
        let classes = `col-${x} row-${y} ${kind} gem`
        this.el.setAttribute('class', classes)
        this.el.setAttribute('data-x',this.model.get('x'))
        this.el.setAttribute('data-y',this.model.get('y'))
        return this
    }
    onDestroy () {
        timeout(150, () => this.el.remove())
    }
}