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
}, false);

var iniciar = {
    iniciarJuego: function(){
        console.log("¡Cargado!");
        buclePrincipal.iterar();
    },
    LoadContent: function(){
        buclePrincipal.LoadContent();
    }
};