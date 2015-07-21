define("js/index", ["exports", "backbone"], function (exports, _backbone) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var A = (function () {
        function A() {
            _classCallCheck(this, A);
        }

        _createClass(A, [{
            key: "getX",
            value: function getX() {
                return 1;
            }
        }]);

        return A;
    })();

    exports.A = A;

    var B = (function (_A) {
        _inherits(B, _A);

        function B() {
            _classCallCheck(this, B);

            _get(Object.getPrototypeOf(B.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(B, [{
            key: "getX",
            value: function getX() {
                return 18;
            }
        }]);

        return B;
    })(A);

    exports.B = B;

    var C = (function (_Backbone$Model) {
        _inherits(C, _Backbone$Model);

        function C() {
            _classCallCheck(this, C);

            _get(Object.getPrototypeOf(C.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(C, [{
            key: "getY",
            value: function getY() {
                return 18;
            }
        }]);

        return C;
    })(_backbone.Model);

    exports.C = C;
});