document.addEventListener('DOMContentLoaded', function(){
    console.log("Se inicia el juego");
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.ctx.font = `15px 'Oswald', sans-serif`;
    iniciar.LoadContent();
    iniciar.iniciarJuego();
    // ping
    io.on('pong', ms => {
        buclePrincipal.ping = ms;
    });
    // tecla
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });
}, false);
var direccion;
$(function() {
    $("#game").swipe( { swipeStatus:swipe2, allowPageScroll:"horizontal" } );
    $(window).blur(function() { keys[65] = false; keys[68] = false;keys[83] = false;keys[87] = false;});
    function swipe2(event, phase, direction, distance) {
        if(direccion != direction){
            keys[65] = false;
            keys[68] = false;
            keys[83] = false;
            keys[87] = false;
        }
        let data = event.pointerType
        direccion = direction;
        if(event.pressure != 0){
            switch(direccion){
                case 'left':
                    keys[65] = true;
                    break;
                case 'right':
                    keys[68] = true;
                    break;
                case 'down':
                    keys[83] = true;
                    break;
                case 'up':
                    keys[87] = true;
                    break;
            }
        }
        if(event.pressure == 0 || phase == 'cancel' || phase == 'end'){
            switch(direccion){
                case 'left':
                    keys[65] = false;
                    break;
                case 'right':
                    keys[68] = false;
                    break;
                case 'down':
                    keys[83] = false;
                    break;
                case 'up':
                    keys[87] = false;
                    break;
            }
        }
    }
  });
var iniciar = {
    iniciarJuego: function(){
        buclePrincipal.iterar();
    },
    LoadContent: function(){
        buclePrincipal.LoadContent();
    }
};