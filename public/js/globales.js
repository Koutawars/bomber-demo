// variables globales
var debug = {
    hit:true,
    info:true
};
var io = io.connect(),
    canvas = document.getElementById("myCanvas"),
    keys = [];
var dir = {
    ARRIBA: "arriba",
    ABAJO: "abajo",
    DERECHA: "derecha",
    IZQUIERDA: "izquierda"
};
canvas.width = 800;
canvas.height = 600;
//canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;