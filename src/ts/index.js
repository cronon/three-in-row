define(["require", "exports", 'backbone'], function (require, exports, bb) {
    var A = (function () {
        function A() {
            this.x = 1;
            this.y = [1, 2];
        }
        A.prototype.getX = function () {
            return this.x;
        };
        return A;
    })();
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    function f(x) {
        return function (y) { return y + x; };
    }
    var M = bb.Model;
});
