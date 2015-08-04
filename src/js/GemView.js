class GemView extends Backbone.View {
    constructor(options) {
        super(options)
        this.template = window.Templates.gem
    }
    render () {
        // console.log(this.model)
        this.el = this.template(this.model.attributes)
        return this
    }
}