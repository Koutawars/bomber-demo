document.addEventListener('DOMContentLoaded', function(){
    console.log("Se inicia el juego");
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.ctx.font = `15px 'Oswald', sans-serif`;
    iniciar.LoadContent();
    iniciar.iniciarJuego();
    // ping
    io.on('msPong', function(data) {
        buclePrincipal.ping = Date.now() - data;
    });
    // tecla
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });
    canvas.addEventListener("mousedown", function(e){
        var x = e.x;
        var y = e.y;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        console.log("x:" + x + " y:" + y);
    }, false);
}, false);

var iniciar = {
    iniciarJuego: function(){
        buclePrincipal.iterar();
    },
    LoadContent: function(){
        buclePrincipal.LoadContent();
    }
};