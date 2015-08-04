window.Templates = window.Templates || {}
Templates.board = function (locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1>Fancy Board</h1>");;return buf.join("");
}
window.Templates = window.Templates || {}
Templates.gem = function (locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (kind, x, y) {
var classes = ['col-'+x, 'row-'+y, 'gem', kind]
buf.push("<div tabindex=\"0\"" + (jade.cls([classes], [true])) + ">" + (jade.escape((jade_interp = x) == null ? '' : jade_interp)) + "" + (jade.escape((jade_interp = y) == null ? '' : jade_interp)) + " </div>");}.call(this,"kind" in locals_for_with?locals_for_with.kind:typeof kind!=="undefined"?kind:undefined,"x" in locals_for_with?locals_for_with.x:typeof x!=="undefined"?x:undefined,"y" in locals_for_with?locals_for_with.y:typeof y!=="undefined"?y:undefined));;return buf.join("");
}