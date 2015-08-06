class Gem extends Backbone.Model{
    constructor(options) {
        super(options)
    }
    remove(){
        this.set('kind','gap')
        this.destroy()
    }
    isGap() {
        return this.get('kind') == 'gap'
    }
}