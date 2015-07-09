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
console.log(a.getX());
