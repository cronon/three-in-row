window.templates = window.templates || {}
templates.board = function (locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<table><tr><td></td></tr><tr><td></td></tr></table>");;return buf.join("");
}
window.templates = window.templates || {}
templates.gem = function (locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (kind) {
buf.push("<div class=\"row-1 col-1 emerald\">" + (jade.escape((jade_interp = kind) == null ? '' : jade_interp)) + "</div>");}.call(this,"kind" in locals_for_with?locals_for_with.kind:typeof kind!=="undefined"?kind:undefined));;return buf.join("");
}