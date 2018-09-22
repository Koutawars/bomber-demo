var playerManager = {
    personajes:[],
    id:0,
    emitStop:true,
    pack:null
};
playerManager.Draw = function(ctx){
    this.personajes.forEach(element => {
        this.personajes[element.id].Draw(ctx);
    });
    camera.Draw(ctx);
}
playerManager.Update = function(){
    this.mover();
    camera.Update();
    this.personajes.forEach(element => {
        this.personajes[element.id].Update();
    });
}
playerManager.solido = function(x, y, player){
    let esSolido = false, temporal;
    temporal = player.hitbox.copiar();
    temporal.x += x;
    temporal.y += y;
    bombManager.bombs.forEach(bomba => {
    if(!bomba.recienColocada){
        esSolido = bomba.hitbox.chocarCon(temporal);
    }
    else if(!bomba.hitbox.chocarCon(temporal))
        bomba.recienColocada = false;
    });
    return esSolido;
};
playerManager.mover = function(){
    if(animationManager.imagenes != null && this.personajes[this.id]!= null){
        let solido = false;
        if(keys[68]){
            solido = !playerManager.solido(this.personajes[this.id].vel , 0, this.personajes[this.id]);
            if(solido)
            {
                this.personajes[this.id].dir = dir.DERECHA;
                this.personajes[this.id].animaciones.stop = false;
                this.personajes[this.id].mov(this.personajes[this.id].vel , 0);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones:{stop: this.personajes[this.id].animaciones.stop},
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }
        else if(keys[65]){
            solido = !playerManager.solido(-this.personajes[this.id].vel , 0, this.personajes[this.id]);
            if(solido)
            {
                this.personajes[this.id].dir = dir.IZQUIERDA;
                this.personajes[this.id].animaciones.stop = false;
                this.personajes[this.id].mov(-this.personajes[this.id].vel , 0);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones:{stop: this.personajes[this.id].animaciones.stop},
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }
        else if(keys[87]){
            solido = !playerManager.solido(0 , -this.personajes[this.id].vel, this.personajes[this.id]);
            if(solido)
            {
                this.personajes[this.id].dir = dir.ARRIBA;
                this.personajes[this.id].animaciones.stop = false;
                this.personajes[this.id].mov(0 , -this.personajes[this.id].vel);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones:{stop: this.personajes[this.id].animaciones.stop},
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }
        else if(keys[83]){
            solido = !playerManager.solido(0 , this.personajes[this.id].vel, this.personajes[this.id]);
            if(solido)
            {
                this.personajes[this.id].dir = dir.ABAJO;
                this.personajes[this.id].animaciones.stop = false;
                this.personajes[this.id].mov(0 , this.personajes[this.id].vel);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones:{stop: this.personajes[this.id].animaciones.stop},
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }else{
            this.personajes[this.id].animaciones.stop = true;
            if(this.emitStop){
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones:{stop: this.personajes[this.id].animaciones.stop},
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = false;
            }
        }
    }
}
    
playerManager.copiar = function(data){
    let copia = new player(data.id, data.x, data.y, data.vel, data.personaje , data.posHitX, data.posHitY, data.anchoHit, data.altoHit, data.numBomb, data.timeBomb, data.largeBomb);
    return copia;
}

io.on('nuevoID', function(data){
    playerManager.id = data;
    playerManager.personajes[playerManager.id] = new player(playerManager.id, 250,100, 5, "lion",0, 45, 40, 20, 3, 3000, 3);
    camera.follow(playerManager.personajes[playerManager.id]);
    io.emit("nuevoJugador", playerManager.personajes[playerManager.id]);
});
// por si entra otro jugador
io.on('nuevoJugador', function(data){
    let copia = playerManager.copiar(data);
    playerManager.personajes[data.id] = copia;
});

// recibe todos los jugadores en la sala
io.on('allplayers', function(data){
    let copia;
    data.forEach(element => {
        copia = playerManager.copiar(element);
        playerManager.personajes[copia.id] = copia;
    });
});
// recibe quien se mueve
io.on('mover', function(data){
    if(playerManager.personajes[data.id] != null){
        playerManager.personajes[data.id].x = data.x;
        playerManager.personajes[data.id].y = data.y;
        playerManager.personajes[data.id].hitbox.x = data.x + playerManager.personajes[data.id].posHitX;
        playerManager.personajes[data.id].hitbox.y = data.y + playerManager.personajes[data.id].posHitY;
        playerManager.personajes[data.id].morir = data.morir;
        playerManager.personajes[data.id].animaciones.stop = data.animaciones.stop;
        playerManager.personajes[data.id].dir = data.dir;
        if(playerManager.personajes[data.id].morir)
            delete playerManager.personajes[data.id];
    }else{
        console.log("No existe el jugador que se mueve");
    }
});
io.on('murio', function(data){
    if(data == playerManager.id) io.emit('delete');
    delete playerManager.personajes[data];
});