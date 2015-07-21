class A {
    getX(){
        return 1;
    }
}
class B extends A {
    getX(){
        return 18;
    }
}
class C extends Backbone.Model {
    getY () {
        return 18;
    }
}