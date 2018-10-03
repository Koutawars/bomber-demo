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
        if(camera.player == null){
            camera.follow(this.personajes[element.id]);
        }
        this.personajes[element.id].Update();
    });
}
playerManager.solido = function(x, y, player){
    let esSolido = false, temporal;
    var fix = false;
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
    if(!esSolido){
        blockManager.blocks.forEach(block => {
            if(block.chocarCon(temporal))
                esSolido = true;
        });
    }
    if(!esSolido){
        blockManager.paredes.forEach(block => {
            if(block.chocarCon(temporal)){
                esSolido = true;
            }
        });
    }
    if(esSolido){
        esSolido = playerManager.fixCorner(x,y);
        fix = true;
    }
    return {f:fix, s: esSolido};
};
playerManager.fixCorner = function(dirX, dirY){
    let x = Math.round(this.personajes[this.id].hitbox.x/ 32);
    let y = Math.round(this.personajes[this.id].hitbox.y/ 32);
    if(dirX != 0)dirX = dirX > 0?1:-1;
    if(dirY != 0)dirY = dirY > 0?1:-1;
    var edgeSize = 30;
    var pos = {x: x, y:y};
    var position;
    var pos1 = { x: x + dirY, y: y + dirX };
    var bmp1 = this.multi(pos1);
    var pos2 = { x: x - dirY, y: y - dirX };
    var bmp2 = this.multi(pos2);
    if(this.estaVacio((pos.x + dirX)*32, (pos.y + dirY)*32)){
        position = pos;
    }
    else if(this.estaVacio(bmp1.x, bmp1.y) && this.estaVacio(bmp1.x + dirX*32, bmp1.y + dirY*32)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp1.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp1.x) < edgeSize){
        position = pos1;
    }
    else if(this.estaVacio(bmp2.x, bmp2.y) && this.estaVacio(bmp2.x + dirX*32, bmp2.y + dirY*32)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp2.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp2.x) < edgeSize){
            position = pos2;
    }
    if(position != null){
        position = this.multi(position);
        if(this.estaVacio(position.x, position.y)){
            var fixX = 0;
            var fixY = 0;
            if (dirX) {
                fixY = (position.y - this.personajes[this.id].hitbox.y) > 0 ? 1 : -1;
            } else {
                fixX = (position.x - this.personajes[this.id].hitbox.x) > 0 ? 1 : -1;
            }
            fixX = fixX* this.personajes[this.id].vel;
            fixY = fixY* this.personajes[this.id].vel;
            this.personajes[this.id].mov( fixX, fixY);
            return false;
        }
    }
    return true;
}
playerManager.estaVacio = function( x, y){
    var retorna = true;
    var caja = new rectangulo( x, y, 1, 1);
    bombManager.bombs.forEach(bomba => {
        if(!bomba.recienColocada){
            retorna = !bomba.hitbox.chocarCon(caja);
        }
    });
    blockManager.blocks.forEach(block => {
        if(block.chocarCon(caja))
            retorna = false;
    });
    if(retorna){
        blockManager.paredes.forEach(block => {
            if(block.chocarCon(caja))
                retorna = false;
        });
    }
    return retorna;
}
playerManager.multi = function(_){
    return {x:_.x*32, y:_.y*32}
}
playerManager.mover = function(){
    if(animationManager.imagenes != null && this.personajes[this.id]!= null){
        
        let solido;
        if((keys[68] || keys[39] ) && this.personajes[this.id].mov){
            solido = playerManager.solido(this.personajes[this.id].vel , 0, this.personajes[this.id]);
            if(!solido.s)
            {
                this.personajes[this.id].dir = dir.DERECHA;
                this.personajes[this.id].animaciones.stop = false;
                if(!solido.f)this.personajes[this.id].mov(this.personajes[this.id].vel , 0);
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
        else if((keys[65] || keys[37] )  && this.personajes[this.id].mov){
            solido = playerManager.solido(-this.personajes[this.id].vel , 0, this.personajes[this.id]);
            if(!solido.s)
            {
                this.personajes[this.id].dir = dir.IZQUIERDA;
                this.personajes[this.id].animaciones.stop = false;
                if(!solido.f)this.personajes[this.id].mov(-this.personajes[this.id].vel , 0);
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
        else if((keys[87] || keys[38] ) && this.personajes[this.id].mov){
            solido = playerManager.solido(0 , -this.personajes[this.id].vel, this.personajes[this.id]);
            if(!solido.s)
            {
                this.personajes[this.id].dir = dir.ARRIBA;
                this.personajes[this.id].animaciones.stop = false;
                if(!solido.f)this.personajes[this.id].mov(0 , -this.personajes[this.id].vel);
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
        else if((keys[83] || keys[40] ) && this.personajes[this.id].mov){
            solido = playerManager.solido(0 , this.personajes[this.id].vel, this.personajes[this.id]);
            if(!solido.s)
            {
                this.personajes[this.id].dir = dir.ABAJO;
                this.personajes[this.id].animaciones.stop = false;
                if(!solido.f)this.personajes[this.id].mov(0 , this.personajes[this.id].vel);
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
    copia.user = data.user;
    return copia;
}

io.on('nuevoID', function(data){
    playerManager.id = data;
    playerManager.personajes[playerManager.id] = new player(playerManager.id, 30, -7, 4, "lion", 15, 45, 20, 20, 3, 3000, 3);
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
    playerManager.personajes[data].animaciones.countReset = 0;
    playerManager.personajes[data].animaciones.frames = 11;
    playerManager.personajes[data].Update = function(){
        playerManager.personajes[data].animaciones.stop = false;
        playerManager.personajes[data].animaciones.Update(11, 13);
        if(playerManager.personajes[data].animaciones.countReset == 1){
            delete playerManager.personajes[data];
            if(camera.player.id == data){
                delete camera.player;
            } 
        }
    }
    playerManager.personajes[data].mov = null;
});
io.on('user', function(user, id){
    playerManager.personajes[id].user = user;
});