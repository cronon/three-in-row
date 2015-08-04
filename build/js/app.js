'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Board = (function (_Backbone$Model) {
    _inherits(Board, _Backbone$Model);

    function Board() {
        _classCallCheck(this, Board);

        _get(Object.getPrototypeOf(Board.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Board, [{
        key: 'initialize',
        value: function initialize(width, height) {
            var gemSet = arguments.length <= 2 || arguments[2] === undefined ? ['emerald', 'ruby', 'diamond', 'sapphire'] : arguments[2];

            this.width = width;
            this.height = height;
            this.gemSet = gemSet;
            this.matrix = new Matrix(width, height, function (_ref) {
                var x = _ref.x;
                var y = _ref.y;

                return new Gem({
                    x: x,
                    y: y,
                    kind: _.sample(gemSet)
                });
            });
        }
    }, {
        key: 'step',
        value: function step() {
            var _this = this;

            var columns = _.groupBy(this.removeGroups(), function (gem) {
                return gem.get('x');
            });
            _.keys(columns).forEach(function (x) {
                return _this.slideColumn(x);
            });
            var columnsHeight = this.columnsHeight();
            var newGems = this.createNewGems(columnsHeight);
            this.pasteNewGems(columnsHeight, newGems);
        }
    }, {
        key: 'removeGroups',
        value: function removeGroups() {
            var toRemove = this.matrix.findGroups(function (g1, g2) {
                return g1.get('kind') == g2.get('kind');
            });
            toRemove = _.union.apply(null, toRemove);
            toRemove.forEach(function (gem) {
                gem.remove();
            });
            return toRemove;
        }
    }, {
        key: 'slideColumn',
        value: function slideColumn(x) {
            var m = this.matrix;
            for (var i = 0; i < m.height - 1; i++) {
                for (var j = 0; j < m.height - 1; j++) {
                    if (m(x, j).isGap()) {
                        m.swap([x, j], [x, j + 1]);
                        m(x, j + 1).set('y', j + 1);
                        m(x, j).set('y', j);
                    }
                }
            }
        }
    }, {
        key: 'columnsHeight',
        value: function columnsHeight() {
            var m = this.matrix;
            return _.range(m.width).reduce(function (memo, x) {
                return memo.concat(_.range(m.height).reduce(function (memo, y) {
                    if (m(x, y).isGap() && y < memo) {
                        return y;
                    } else {
                        return memo;
                    }
                }, m.height));
            }, []);
        }
    }, {
        key: 'createNewGems',
        value: function createNewGems(columnsHeight) {
            var _this2 = this;

            var m = this.matrix;
            return m.foldl(function (memo, item, _ref2) {
                var x = _ref2.x;
                var y = _ref2.y;

                if (item.isGap()) {
                    return memo.concat(new Gem({
                        x: x,
                        y: m.height + y - columnsHeight[x],
                        kind: _.sample(_this2.gemSet)
                    }));
                } else {
                    return memo;
                }
            }, []);
        }
    }, {
        key: 'pasteNewGems',
        value: function pasteNewGems(columnsHeight, newGems) {
            var m = this.matrix;
            newGems.forEach(function (gem) {
                var x = gem.get('x');
                var y = gem.get('y') - m.height + columnsHeight[x];
                m(x, y, gem);
                gem.set('y', y);
            });
        }
    }, {
        key: 'swap',
        value: function swap(_ref3, _ref4) {
            var _ref32 = _slicedToArray(_ref3, 2);

            var x1 = _ref32[0];
            var y1 = _ref32[1];

            var _ref42 = _slicedToArray(_ref4, 2);

            var x2 = _ref42[0];
            var y2 = _ref42[1];

            if (Math.abs(x1 - x2) + Math.abs(y1 - y2) != 1) {
                return null;
            }
            var m = this.matrix;
            m.swap([x1, y1], [x2, y2]);
            var groups = m.findGroups(function (g1, g2) {
                return g1.get('kind') == g2.get('kind');
            });
            if (groups.length == 0) {
                m.swap([x1, y1], [x2, y2]);
                return false;
            } else {
                return true;
            }
        }
    }]);

    return Board;
})(Backbone.Model);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BoardView = (function (_Backbone$View) {
    _inherits(BoardView, _Backbone$View);

    function BoardView(options) {
        _classCallCheck(this, BoardView);

        _.defaults(options, {
            events: {
                'focus .gem': 'focusGem'
            },
            el: $("#board")[0]
        });

        _get(Object.getPrototypeOf(BoardView.prototype), 'constructor', this).call(this, options);
        this.template = window.Templates.board;
    }

    _createClass(BoardView, [{
        key: 'render',
        value: function render() {
            var _this = this;

            this.$el.empty().append(this.template());
            this.model.matrix.foldl(function (memo, gem) {
                var gemView = new GemView({ model: gem });
                _this.$el.append(gemView.render().el);
            });
            return this;
        }
    }, {
        key: 'focusGem',
        value: function focusGem(e) {
            var _this2 = this;

            if (this.focused) {
                (function () {
                    var m = _this2.model.matrix;
                    var _e$currentTarget$dataset = e.currentTarget.dataset;
                    var x1 = _e$currentTarget$dataset.x;
                    var y1 = _e$currentTarget$dataset.y;
                    var _focused$dataset = _this2.focused.dataset;
                    var x2 = _focused$dataset.x;
                    var y2 = _focused$dataset.y;

                    var g1 = m(x1, y1),
                        g2 = m(x2, y2);
                    var swap = _this2.model.swap([x1, y1], [x2, y2]);
                    if (swap === null) {
                        _this2.focused = e.currentTarget;
                    } else if (swap === false) {
                        g1.set('x', x2);g1.set('y', y2);
                        g2.set('x', x1);g2.set('y', y1);
                        setTimeout(function () {
                            g1.set('x', x1);g1.set('y', y1);
                            g2.set('x', x2);g2.set('y', y2);
                        }, 200);
                        e.currentTarget.blur();
                        _this2.focused = false;
                    } else if (swap === true) {
                        g1.set('x', x2);g1.set('y', y2);
                        g2.set('x', x1);g2.set('y', y1);
                        while (_this2.loop()) {}
                        e.currentTarget.blur();
                        _this2.focused = false;
                    }
                })();
            } else {
                this.focused = e.currentTarget;
            }
        }
    }, {
        key: 'loop',
        value: function loop() {
            var columns = new Set(this.model.removeGroups().map(function (gem) {
                return gem.get('x');
            }));
            return false;
        }
    }]);

    return BoardView;
})(Backbone.View);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Gem = (function (_Backbone$Model) {
    _inherits(Gem, _Backbone$Model);

    function Gem(options) {
        _classCallCheck(this, Gem);

        _get(Object.getPrototypeOf(Gem.prototype), 'constructor', this).call(this, options);
    }

    _createClass(Gem, [{
        key: 'remove',
        value: function remove() {
            this.set('kind', 'gap');
        }
    }, {
        key: 'isGap',
        value: function isGap() {
            return this.get('kind') == 'gap';
        }
    }]);

    return Gem;
})(Backbone.Model);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var GemView = (function (_Backbone$View) {
    _inherits(GemView, _Backbone$View);

    function GemView(options) {
        _classCallCheck(this, GemView);

        _get(Object.getPrototypeOf(GemView.prototype), 'constructor', this).call(this, options);
        this.$el.attr('tabindex', 0);
        this.$el.html('' + this.model.get('x') + this.model.get('y'));
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    }

    _createClass(GemView, [{
        key: 'render',
        value: function render() {
            var _model$attributes = this.model.attributes;
            var x = _model$attributes.x;
            var y = _model$attributes.y;
            var kind = _model$attributes.kind;

            var classes = 'col-' + x + ' row-' + y + ' ' + kind + ' gem';
            this.$el.attr('class', classes).attr('data-x', this.model.get('x')).attr('data-y', this.model.get('y'));
            return this;
        }
    }]);

    return GemView;
})(Backbone.View);
"use strict";

function newArray(size) {
    return Array.apply(null, Array(size));
}
'use strict';

$(function () {
    var gemSet = 'ruby emerald topaz sapphire amber amethyst diamond'.split(' ');
    var board = new Board(8, 8, gemSet);
    var boardView = new BoardView({ model: board });
    window.BV = boardView;
    window.B = board;
    boardView.render();
});
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function Matrix(width, height) {
    var defaultCb = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

    var array = newArray(height).map(function (_, y) {
        return newArray(width).map(function (_, x) {
            return defaultCb({ x: x, y: y });
        });
    });
    var m = function m(x, y, newValue) {
        if (x > width - 1) {
            throw Error("x " + x + " out of range");
        }
        if (y > height - 1) {
            throw Error("y " + y + " is out of range");
        }
        if (arguments.length == 2) {
            return array[y][x];
        } else if (arguments.length == 3) {
            return array[y][x] = newValue;
        } else {
            throw Error("Arguments not supported " + arguments);
        }
    };
    m.width = width;
    m.height = height;
    m.foldl = function (f, initialValue) {
        var memo = initialValue;
        array.forEach(function (row, y) {
            row.forEach(function (item, x) {
                memo = f(memo, item, { x: x, y: y });
            });
        });
        return memo;
    };

    m.toArray = function () {
        return array.map(function (row) {
            return row.slice();
        });
    };

    m.map = function (f) {
        return new Matrix(this.width, this.height, function (_ref) {
            var x = _ref.x;
            var y = _ref.y;

            return f(m(x, y), { x: x, y: y });
        });
    };

    m.clone = function () {
        return Matrix.fromArray(m.toArray());
    };

    m.findGroups = function () {
        var cmp = arguments.length <= 0 || arguments[0] === undefined ? function (x, y) {
            return x == y;
        } : arguments[0];

        var horizontalGroups = _.range(m.height).reduce(function (memo, y) {
            var groupedRow = _.range(m.width).reduce(function (memo, x) {
                if (x == 0) {
                    return [[m(x, y)]];
                } else if (cmp(_.last(_.last(memo)), m(x, y))) {
                    memo[memo.length - 1].push(m(x, y));
                } else {
                    memo.push([m(x, y)]);
                }
                return memo;
            }, []);
            return memo.concat(groupedRow);
        }, []);

        var verticalGroups = _.range(m.width).reduce(function (memo, x) {
            var groupedRow = _.range(m.height).reduce(function (memo, y) {
                if (y == 0) {
                    return [[m(x, y)]];
                } else if (cmp(_.last(_.last(memo)), m(x, y))) {
                    memo[memo.length - 1].push(m(x, y));
                } else {
                    memo.push([m(x, y)]);
                }
                return memo;
            }, []);
            return memo.concat(groupedRow);
        }, []);
        var groups = horizontalGroups.concat(verticalGroups);
        return _.filter(groups, function (group) {
            if (group.length > 2) {
                return true;
            } else {
                return false;
            }
        });
    };

    m.swap = function (_ref2, _ref3) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var x1 = _ref22[0];
        var y1 = _ref22[1];

        var _ref32 = _slicedToArray(_ref3, 2);

        var x2 = _ref32[0];
        var y2 = _ref32[1];

        var temp = m(x1, y1);
        m(x1, y1, m(x2, y2));
        m(x2, y2, temp);
    };
    return m;
}
Matrix.fromArray = function (array) {
    var height = array.length;
    var width = array[0].length;
    return new Matrix(width, height, function (_ref4) {
        var x = _ref4.x;
        var y = _ref4.y;

        return array[y][x];
    });
};