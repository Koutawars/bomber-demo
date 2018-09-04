document.addEventListener('DOMContentLoaded', function(){
    console.log("Se inicia el juego");
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.myOwn = new player(0, 250,100, 'img/lion.png', 10, 45, 30, 20, 1, 3000, 1);
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
                personaje.x = data.x;
                personaje.y = data.y;
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
    iniciar.iniciarJuego();
    // movimientos
    document.body.onkeydown = function(e){
        if(buclePrincipal.myOwn != null){
            console.log(e.keyCode);
            if (e.keyCode === 87 && buclePrincipal.solido(0,-7, buclePrincipal.myOwn)) {
                buclePrincipal.arriba = true; // arriba
                buclePrincipal.abajo = false; // abajo
                buclePrincipal.izquierda = false; // izquierda
                buclePrincipal.derecha = false; // derecha
            }
            else if (e.keyCode === 83 && buclePrincipal.solido(0,7, buclePrincipal.myOwn)) {
                buclePrincipal.arriba = false; // arriba
                buclePrincipal.abajo = true; // abajo
                buclePrincipal.izquierda = false; // izquierda
                buclePrincipal.derecha = false; // derecha
            }
            else if (e.keyCode === 65 && buclePrincipal.solido(-7,0, buclePrincipal.myOwn)) {
                buclePrincipal.arriba = false; // arriba
                buclePrincipal.abajo = false; // abajo
                buclePrincipal.izquierda = true; // izquierda
                buclePrincipal.derecha = false; // derecha
            } 
            else if (e.keyCode === 68 && buclePrincipal.solido(7,0, buclePrincipal.myOwn)) {
                buclePrincipal.arriba = false; // arriba
                buclePrincipal.abajo = false; // abajo
                buclePrincipal.izquierda = false; // izquierda
                buclePrincipal.derecha = true; // derecha
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
                buclePrincipal.arriba = false; // arriba
            }
            if(e.keyCode == 83 ){
                buclePrincipal.abajo = false; // abajo
            }
            if(e.keyCode == 65){
                buclePrincipal.izquierda = false; // izquierda
            }
            if( e.keyCode == 68){
                buclePrincipal.derecha = false; // derecha
            }
        }
    }, true);
}, false);

var iniciar = {
    iniciarJuego: function(){
        buclePrincipal.iterar();
    }
};