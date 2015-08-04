class Gem extends Backbone.Model{
    constructor(options) {
        super(options)
    }
    remove(){
        this.set('kind','gap')
    }
    isGap() {
        return this.get('kind') == 'gap'
    }
}