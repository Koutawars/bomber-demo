var playerManager = {
    personajes:[],
    pj:[],
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
    let llaves = Object.keys(bombManager.bombs);
    let element; 
    for(let i = 0 ;i < llaves.length; i++){ 
        element = bombManager.bombs[llaves[i]];
        if(!element.recienColocada){
            esSolido = element.hitbox.chocarCon(temporal);
            if(esSolido) break;
        }
        else if(!element.hitbox.chocarCon(temporal))
            element.recienColocada = false;
    }
    if(!esSolido && !player.atra){
        llaves = Object.keys(blockManager.blocks);
        for(let i = 0 ;i < llaves.length; i++){ 
            element = blockManager.blocks[llaves[i]];
            if(element.chocarCon(temporal)){
                esSolido = true;
                break;
            }
        }
    }
    if(!esSolido){
        llaves = Object.keys(blockManager.paredes);
        for(let i = 0 ;i < llaves.length; i++){ 
            element = blockManager.paredes[llaves[i]];
            if(element.chocarCon(temporal)){
                esSolido = true;
                break;
            }
        }
    }
    if(esSolido){
        esSolido = playerManager.fixCorner(x,y,player.atra);
        fix = true;
    }
    return {f:fix, s: esSolido};
};
playerManager.fixCorner = function(dirX, dirY, atra){
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
    if(this.estaVacio((pos.x + dirX)*32, (pos.y + dirY)*32, atra)){
        position = pos;
    }
    else if(this.estaVacio(bmp1.x, bmp1.y, atra) && this.estaVacio(bmp1.x + dirX*32, bmp1.y + dirY*32, atra)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp1.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp1.x) < edgeSize){
        position = pos1;
    }
    else if(this.estaVacio(bmp2.x, bmp2.y, atra) && this.estaVacio(bmp2.x + dirX*32, bmp2.y + dirY*32, atra)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp2.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp2.x) < edgeSize){
            position = pos2;
    }
    if(position != null){
        position = this.multi(position);
        if(this.estaVacio(position.x, position.y, atra)){
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
playerManager.estaVacio = function( x, y, atra){
    var retorna = true;
    var caja = new rectangulo( x, y, 1, 1);
    let llaves = Object.keys(bombManager.bombs);
    let element; 
    for(let i = 0 ;i < llaves.length; i++){ 
        element = bombManager.bombs[llaves[i]];
        if(!element.recienColocada){
            retorna = !element.hitbox.chocarCon(caja);
            break;
        }
    }
    bombManager.bombs.forEach(element => {
        if(!element.recienColocada){
            retorna = !element.hitbox.chocarCon(caja);
        }
    });
    if(retorna && !atra){
        llaves = Object.keys(blockManager.blocks);
        for(let i = 0 ;i < llaves.length; i++){ 
            element = blockManager.blocks[llaves[i]];
            if(element.chocarCon(caja)){
                retorna = false;
                break;
            }
        }
    }
    if(retorna){
        llaves = Object.keys(blockManager.paredes);
        for(let i = 0 ;i < llaves.length; i++){ 
            element = blockManager.paredes[llaves[i]];
            if(element.chocarCon(caja)){
                retorna = false;
                break;
            }
        }
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

io.on('nuevoID', function(data, user, pj){
    playerManager.id = data;
    let c = playerManager.posicionRandom();
    playerManager.personajes[playerManager.id] = new player(playerManager.id, 30, -7, 2, pj, 5, 45, 25, 17, 1, 3000, 1);
    playerManager.personajes[playerManager.id].user = user;
    playerManager.personajes[playerManager.id].cambiarPos(c.x, c.y);
    camera.follow(playerManager.personajes[playerManager.id]);
    io.emit("nuevoJugador", playerManager.personajes[playerManager.id]);
});
// por si entra otro jugador
io.on('nuevoJugador', function(data){
    let copia = playerManager.copiar(data);
    playerManager.personajes[data.id] = copia;
    if(data.id == playerManager.id) camera.follow(playerManager.personajes[data.id]);
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
playerManager.posicionRandom = function(){
    var vectorX =[1,19,37,9,29,1 ,19,37,29,1 ,19,37];
    var vectorY =[1,1 ,1 ,7,7 ,15,15,15,21,27,27,27];
    var j = getRndInteger(0, vectorX.length-1);
    var c= {
        x:vectorX[j]*32,
        y:vectorY[j]*32
    }
    return c;
}