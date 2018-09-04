// variables globales
var debug = {
    hit:true,
    info:true
};
var io = io.connect();
var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;