class BoardView extends Backbone.View {
    constructor(options){
        _.defaults(options, {
            events: {
                'focus .gem': 'focusGem'
            },
            el: $("#board")[0]
        })

        super(options)
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

    focusGem (e) {
        console.log(this.focused)
        if (this.focused) {
            let m = this.model.matrix
            let {x: x1, y: y1} = e.currentTarget.dataset
            let {x: x2, y: y2} = this.focused.dataset
            let g1 = m(x1,y1), g2 = m(x2,y2)
            let swap = this.model.swap([x1,y1],[x2,y2])
            if ( swap === null) {
                this.focused = e.currentTarget
            } else if (swap === false) {
                g1.set('x',x2); g1.set('y',y2)
                g2.set('x',x1); g2.set('y',y1)
                setTimeout(() => {
                    g1.set('x',x1); g1.set('y',y1)
                    g2.set('x',x2); g2.set('y',y2)
                }, 200)
                e.currentTarget.blur()
                this.focused = false
            } else if (swap === true) {
                g1.set('x',x2); g1.set('y',y2)
                g2.set('x',x1); g2.set('y',y1)
                this.loop()
                e.currentTarget.blur()
                this.focused = false
            }
        } else {
            this.focused = e.currentTarget
        }
    }
    loop () {
        let columns = new Set(
            this.model.removeGroups()
                .map(gem => gem.get('x'))
        )
        function delay(ms) {
            let start = Date.now()
            while(Date.now() - start < ms);
        }
        setTimeout( () => {
            columns.forEach(x => this.model.slideColumn(x))
            let columnsHeight = this.model.columnsHeight()
            let newGems = this.model.createNewGems(columnsHeight)
            newGems.forEach(g => {
                let gemView = new GemView({model: g})
                this.$el.append(gemView.render().el)
            })
            this.model.pasteNewGems(columnsHeight, newGems)
            if( columns.length !== 0) {
                setTimeout(this.loop.bind(this), 750)
            }
            if( !this.model.swapsPossibility()) {
                $("#board h1").html("No more matches")
            }
        }, 250)
    }
}