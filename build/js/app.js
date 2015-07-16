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
var a = new A();
var _a = [1, 2, 3, 4], b = _a[0], c = _a.slice(1);
console.log(b, c);
