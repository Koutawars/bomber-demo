document.addEventListener('DOMContentLoaded', function(){
    console.log("Se inicia el juego");
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.myOwn = new player(0, 250,100, 5, 'img/lion', 17,0, 45, 40, 20, 3, 3000, 3);
    io.emit('nuevoJugador', buclePrincipal.myOwn);
    // le coloco una ID
    io.on('cambiarID', function(data){
        buclePrincipal.myOwn.id = data.id;
    });
    buclePrincipal.ctx.font = `15px 'Oswald', sans-serif`;
    // recibe todos los jugadores en la sala
    io.on('allplayers', function(data){
        data.forEach(element => {
            var copia = buclePrincipal.copiar(element);
            buclePrincipal.personajes.push(copia);
        });
    });
    // por si entra otro jugador
    io.on('nuevoJugador', function(data){
        var copia = buclePrincipal.copiar(data);
        buclePrincipal.personajes.push(copia);
    });
    // recibe quien se mueve
    io.on('mover', function(data){
        buclePrincipal.personajes.forEach(element => {
            if(element.id == data.id){
                var personaje = buclePrincipal.personajes[buclePrincipal.personajes.indexOf(element)];
                if(personaje.x == data.x && personaje.y == data.y)
                    personaje.animaciones.stop = true;
                else
                    personaje.animaciones.stop = data.animaciones.stop;
                personaje.x = data.x;
                personaje.y = data.y;
                personaje.arriba = data.arriba;
                personaje.abajo = data.abajo;
                personaje.derecha = data.derecha;
                personaje.izquierda = data.izquierda;
            }
        });
    });
    // se desconecta un jugador
    io.on('remove', function(data){
        buclePrincipal.personajes.forEach(element => {
            if(element.id == data.id){
                console.log("SE MURIO");
                delete buclePrincipal.personajes[buclePrincipal.personajes.indexOf(element)];
            }
        });
    });
    //Alguien coloca una bomba
    io.on('colocoBomba',function(data){
        buclePrincipal.colocarBomba(data);
    });
    io.on('msPong', function(data) {
        buclePrincipal.ping = Date.now() - data;
    });
    iniciar.iniciarJuego();
    // movimientos
    document.body.onkeydown = function(e){
        if(buclePrincipal.myOwn != null){
            if (e.keyCode === 87) {
                buclePrincipal.myOwn.animaciones.stop = false;
                buclePrincipal.myOwn.arriba = true; // arriba
                buclePrincipal.myOwn.abajo = false; // abajo
                buclePrincipal.myOwn.izquierda = false; // izquierda
                buclePrincipal.myOwn.derecha = false; // derecha
            }
            else if (e.keyCode === 83) {
                buclePrincipal.myOwn.animaciones.stop = false;
                buclePrincipal.myOwn.arriba = false; // arriba
                buclePrincipal.myOwn.abajo = true; // abajo
                buclePrincipal.myOwn.izquierda = false; // izquierda
                buclePrincipal.myOwn.derecha = false; // derecha
            }
            else if (e.keyCode === 65) {
                buclePrincipal.myOwn.animaciones.stop = false;
                buclePrincipal.myOwn.arriba = false; // arriba
                buclePrincipal.myOwn.abajo = false; // abajo
                buclePrincipal.myOwn.izquierda = true; // izquierda
                buclePrincipal.myOwn.derecha = false; // derecha
            } 
            else if (e.keyCode === 68) {
                buclePrincipal.myOwn.animaciones.stop = false;
                buclePrincipal.myOwn.arriba = false; // arriba
                buclePrincipal.myOwn.abajo = false; // abajo
                buclePrincipal.myOwn.izquierda = false; // izquierda
                buclePrincipal.myOwn.derecha = true; // derecha
            }
            if(e.keyCode === 32 && buclePrincipal.myOwn.numBomb >= 1){
                buclePrincipal.colocarBomba(buclePrincipal.myOwn);
                io.emit('newBomba', buclePrincipal.myOwn);
            }
        }
    };
    document.addEventListener('keyup', function (e) {
        if(buclePrincipal.myOwn != null){
            if (e.keyCode == 87) {
                buclePrincipal.myOwn.arriba = false; // arriba
                if(!buclePrincipal.myOwn.arriba && !buclePrincipal.myOwn.abajo && !buclePrincipal.myOwn.izquierda && !buclePrincipal.myOwn.derecha)
                {
                    buclePrincipal.myOwn.animaciones.stop = true;
                    buclePrincipal.emitQuieto = true;
                }
            }
            if(e.keyCode == 83 ){
                buclePrincipal.myOwn.abajo = false; // abajo
                if(!buclePrincipal.myOwn.arriba && !buclePrincipal.myOwn.abajo && !buclePrincipal.myOwn.izquierda && !buclePrincipal.myOwn.derecha)
                {
                    buclePrincipal.myOwn.animaciones.stop = true;
                    buclePrincipal.emitQuieto = true;
                }
            }
            if(e.keyCode == 65){
                buclePrincipal.myOwn.izquierda = false; // izquierda
                if(!buclePrincipal.myOwn.arriba && !buclePrincipal.myOwn.abajo && !buclePrincipal.myOwn.izquierda && !buclePrincipal.myOwn.derecha)
                {
                    buclePrincipal.myOwn.animaciones.stop = true;
                    buclePrincipal.emitQuieto = true;
                }
            }
            if( e.keyCode == 68){
                buclePrincipal.myOwn.derecha = false; // derecha
                if(!buclePrincipal.myOwn.arriba && !buclePrincipal.myOwn.abajo && !buclePrincipal.myOwn.izquierda && !buclePrincipal.myOwn.derecha)
                {
                    buclePrincipal.myOwn.animaciones.stop = true;
                    buclePrincipal.emitQuieto = true;
                }
            }
        }
    }, true);
}, false);

var iniciar = {
    iniciarJuego: function(){
        buclePrincipal.iterar();
    }
};