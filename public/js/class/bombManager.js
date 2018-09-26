var bombManager = {
    bombs:[],
    explosions:[],
    typeExplo:[],
    puesta:false,
    type: {
        CENTER:0,
        TOPMID:1,
        TOP:2,
        BOTMID:3,
        BOT:4,
        RIGHTMID: 5,
        RIGHT: 6,
        LEFT: 7,
        LEFTMID: 8
    },
    animationExplo: []
};
bombManager.Draw = function(ctx){
    this.bombs.forEach(element => {
        element.Draw(ctx);
    });
    this.explosions.forEach(element => {
        let index = this.explosions.indexOf(element);
        if(debug.hit){
            element.Draw(ctx);
        }
        this.UpdateDrawExploAnimation(ctx, index);
    });
};
bombManager.UpdateDrawExploAnimation = function(ctx, index){
    switch(this.typeExplo[index]){
        case this.type.CENTER:
            bombManager.animationExplo[index].Update(0,2);
            bombManager.animationExplo[index].Draw(ctx, bombManager.explosions[index].x, bombManager.explosions[index].y);
        break;
    }
    if(bombManager.animationExplo[index]){
        if(bombManager.animationExplo[index].countReset > 1){
            bombManager.animationExplo[index].stop = true;
        }
    }
}

bombManager.Update = function(){
    this.bombs.forEach(element => {
        element.Update();
    });
    playerManager.personajes.forEach(player => {
        bombManager.explosions.forEach(explo => {
            if(player.hitbox.chocarCon(explo)){
                io.emit("murio", player.id);
            }
        });
    });
    if(keys[32] && playerManager.personajes[playerManager.id]!= null){
        let tocar = bombManager.SobreBomb(playerManager.personajes[playerManager.id].hitbox);
        if(!tocar && !this.puesta && playerManager.personajes[playerManager.id].numBomb > 0)
        {
            playerManager.personajes[playerManager.id].numBomb -= 1;
            this.puesta = true;
            let x, y;
            x = Math.floor(playerManager.personajes[playerManager.id].hitbox.x/32) * 32;
            y = Math.floor(playerManager.personajes[playerManager.id].hitbox.y/32) * 32;
            io.emit('newBomb', {x:x , y: y});
        }
    }
};
bombManager.colocarBomba = function(data){
    var player = playerManager.personajes[data.id];
    var bomba = new bomb(data.x ,data.y, player.timeBomb, player.largeBomb);
    if(playerManager.personajes[playerManager.id] !=  null){
        if(player.id != playerManager.id) bomba.recienColocada = false;
    }
    bomba.coloca = player;
    this.bombs.push(bomba);
    bomba.tmp = setTimeout(this.temporizador, player.timeBomb, bomba, player);
}

bombManager.temporizador =  function(bomba, coloca){
    if(bombManager.bombs.indexOf(bomba) != -1){
        delete bombManager.bombs[bombManager.bombs.indexOf(bomba)];
        // explosión del centro
        var bX = bomba.x,  bY = bomba.y, bAncho = bomba.hitbox.ancho, bAlto = bomba.hitbox.alto;
        var Texplo = 500; // tiempo que dura las explosiones
        var explo = new rectangulo(bX, bY, bAncho, bAlto); // se crea una explosión
        var index;
        index = bombManager.explosions.push(explo) - 1;
        bombManager.typeExplo[index] = bombManager.type.CENTER;
        bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], 0.1);
        bombManager.animationExplo[index].stop = false;
        setTimeout(bombManager.tiempoExplo, Texplo, explo);
        var tpm;
        //explosión arriba
        var n = 1;
        do{
            explo = new rectangulo(bX, bY - bAlto*n, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                index = bombManager.explosions.push(explo) - 1;
                if(coloca.largeBomb == n)
                    bombManager.typeExplo[index] = bombManager.type.TOP;
                else
                    bombManager.typeExplo[index] = bombManager.type.TOPMID;
                bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], 0.1);
                bombManager.animationExplo[index].stop = false;
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explosión abajo
        do{
            explo = new rectangulo(bX, bY + bAlto*n, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                index = bombManager.explosions.push(explo) - 1;
                if(coloca.largeBomb == n)
                    bombManager.typeExplo[index] = bombManager.type.BOT;
                else
                    bombManager.typeExplo[index] = bombManager.type.BOTMID;
                    bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], 0.1);
                    bombManager.animationExplo[index].stop = false;
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb+ 1);
        n = 1;
        // Explosión a la derecha
        do{
            explo = new rectangulo(bX + bAlto*n, bY, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                index = bombManager.explosions.push(explo) - 1;
                if(coloca.largeBomb == n)
                    bombManager.typeExplo[index] = bombManager.type.RIGHT;
                else
                    bombManager.typeExplo[index] = bombManager.type.RIGHTMID;
                    bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], 0.1);
                    bombManager.animationExplo[index].stop = false;
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explsión a la izquierda
        do{
            explo = new rectangulo(bX - bAlto*n, bY, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                index = bombManager.explosions.push(explo) - 1;
                if(coloca.largeBomb == n)
                    bombManager.typeExplo[index] = bombManager.type.LEFT;
                else
                    bombManager.typeExplo[index] = bombManager.type.LEFTMID;
                    bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], 0.1);
                    bombManager.animationExplo[index].stop = false;
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        if(playerManager.personajes[playerManager.id])
            if(playerManager.personajes[playerManager.id].numBomb < playerManager.personajes[playerManager.id].numMaxBomb)
                if(coloca.id == playerManager.id){
                    io.emit("sumBomb");
                    playerManager.personajes[playerManager.id].numBomb +=1;
                }
    }
};
bombManager.tocarBomb = function(hit){
    var retornar = {toco:false, bomba:null};
    var encontro = true;
    bombManager.bombs.forEach(element => {
        if(element.hitbox.chocarCon(hit)){
            retornar.toco = true;
            retornar.bomba = element;
        };
    });
    if(!retornar.toco){
        this.explosions.forEach(explo => {
            if(explo.chocarCon(hit)){
                retornar.toco = true;
            };
        });
    }
    if(!retornar.toco){
        blockManager.blocks.forEach(block => {
            if(hit.chocarCon(block) && encontro){
                retornar.toco = true;
                let index = blockManager.blocks.indexOf(block);
                io.emit('destroyBlock', index);
                delete blockManager.blocks[index];
                encontro = false;
            }
        });
    }
    return retornar;
};
bombManager.SobreBomb = function(hit){
    var retornar = false;
    bombManager.bombs.forEach(element => {
        if(hit.chocarCon(element.hitbox)){
            retornar = true;
        };
    });
    return retornar;
}

bombManager.tiempoExplo =  function(explo){
    let index = bombManager.explosions.indexOf(explo);
    if(index != -1){
        delete bombManager.typeExplo[index];
        delete bombManager.explosions[index];
    }
}

io.on('newBomb', function(data){
    if(data.id == playerManager.id)bombManager.puesta = false; 
    bombManager.colocarBomba(data);
});