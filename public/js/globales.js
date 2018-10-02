// variables globales
var debug = {
    hit:false,
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
canvas.width = 360;
canvas.height = 640;
//canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}