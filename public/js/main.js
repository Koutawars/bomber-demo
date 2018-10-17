document.addEventListener('DOMContentLoaded', function(){
    console.log("Se inicia el juego");
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.ctx.font = `1.1em 'Oswald', sans-serif`;
    iniciar.LoadContent();
    iniciar.iniciarJuego();
    // ping
    io.on('pong', ms => {
        buclePrincipal.ping = ms;
    });
    // se oprime la tecla
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    // se levanta
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });
}, false);
var direccion;
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('orientationchange', resizeCanvas, false);


// movimiento telefono
$(function() {
    $("#game").swipe( { swipeStatus:swipe2, allowPageScroll:"horizontal" } );
    $(window).blur(function() { keys[65] = false; keys[68] = false;keys[83] = false;keys[87] = false;});
    function swipe2(e, phase, direction, distance) {
        if(jQuery.browser.mobile && buclePrincipal.screen == screenManager.screen.GAME){
            var div = $(window);
            var event = e.touches[0] || e.changedTouches[0];
            let x = event.pageX;
            let y = event.pageY;
            if(direccion != direction){
                keys[65] = false;
                keys[68] = false;
                keys[83] = false;
                keys[87] = false;
            }
            let data = event.pointerType
            direccion = direction;
            if(event.pressure != 0){
                if(x >= div.width()/2 && y >= div.height()/2){
                    keys[87] = false;
                    keys[83] = false;
                    keys[68] = false;
                    keys[65] = false;
                    keys[32] = true;
                }
                else
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
                if(x >= div.width()/2 && y >= div.height()/2){
                    keys[87] = false;
                    keys[83] = false;
                    keys[68] = false;
                    keys[65] = false;
                    keys[32] = false;
                }
                else{
                    keys[32] = false;
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
