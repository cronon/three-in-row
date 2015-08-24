class BoardView extends Backbone.NativeView {
    constructor(options){
        _.defaults(options, {
            el: document.getElementById("board")
        })

        super(options)
        this.title = document.getElementById("title")
        this.shuffleHeader = document.getElementById("shuffle")
        this.shuffleHeader.addEventListener('click', this.shuffle.bind(this))
        this.shuffle()
        this.delegate('click', '.gem', this.focusGem.bind(this))
    }

    render () {
        this.shuffleHeader.classList.add('hidden')
        this.title.classList.remove('hidden')
        this.el.innerHTML = '';
        this.model.matrix.foldl((memo, gem) => {
            let gemView = new GemView({model: gem})
            this.el.appendChild(gemView.render().el)
        })
        return this
    }

    focusGem (e) {
        if (this.focused) {
            let m = this.model.matrix
            let {x: x1, y: y1} = e.target.dataset
            let {x: x2, y: y2} = this.focused.dataset
            let g1 = m(x1,y1), g2 = m(x2,y2)
            let swap = this.model.swap([x1,y1],[x2,y2])
            if ( swap === null) {
                this.focused = e.target
            } else if (swap === false) {
                g1.set('x',x2); g1.set('y',y2)
                g2.set('x',x1); g2.set('y',y1)
                setTimeout(() => {
                    g1.set('x',x1); g1.set('y',y1)
                    g2.set('x',x2); g2.set('y',y2)
                }, 200)
                e.target.blur()
                this.focused = false
            } else if (swap === true) {
                g1.set('x',x2); g1.set('y',y2)
                g2.set('x',x1); g2.set('y',y1)
                this.loop()
                e.target.blur()
                this.focused = false
            }
        } else {
            this.focused = e.target
        }
    }
    loop () {
        let overlay = document.getElementById('overlay')
        overlay.classList.remove('hidden')
        let columns, columnsHeight, newGems
        timeout(250, () => {
            columns = new Set(
                this.model.removeGroups()
                    .map(gem => gem.get('x'))
            )
            if (columns.size == 0) overlay.classList.add('hidden')
        }).then(() => timeout(250, () => {
            columns.forEach(x => this.model.slideColumn(x))
            columnsHeight = this.model.columnsHeight()
            newGems = this.model.createNewGems(columnsHeight)
            let fragment = document.createDocumentFragment()
            newGems.forEach(g => {
                let gemView = new GemView({model: g})
                fragment.appendChild(gemView.render().el)
            })
            this.el.appendChild(fragment)
        })).then(() => timeout(250, () => {
            this.model.pasteNewGems(columnsHeight, newGems)
            if( columns.size !== 0) {
                setTimeout(this.loop.bind(this), 0)
            }
            if( !this.model.swapsPossibility()) {
                this.shuffleHeader.classList.remove('hidden')
                this.title.classList.add('hidden')
            }
        }))
    }
    shuffle (e) {
        const gemSet = 'ruby emerald topaz sapphire amber amethyst diamond'.split(' ')
        let board = new Board(8,8, gemSet)
        this.model = board
        this.render()
    }
}