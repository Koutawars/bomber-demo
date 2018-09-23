var bombManager = {
    bombs:[],
    explosions:[],
    puesta:false
};
bombManager.Draw = function(ctx){
    this.bombs.forEach(element => {
        element.Draw(ctx);
    });
    if(debug.hit){
        this.explosions.forEach(element => {
            element.Draw(ctx);
        });
    }
};

bombManager.Update = function(){
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
        bombManager.explosions.push(explo);

        setTimeout(bombManager.tiempoExplo, Texplo, explo);
        var tpm;
        //explosión arriba
        var n = 1;
        do{
            explo = new rectangulo(bX, bY - bAlto*n -n, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                bombManager.explosions.push(explo);
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explosión abajo
        do{
            explo = new rectangulo(bX, bY + bAlto*n + n, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                bombManager.explosions.push(explo);
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb+ 1);
        n = 1;
        // Explosión a la derecha
        do{
            explo = new rectangulo(bX + bAlto*n + n, bY, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                bombManager.explosions.push(explo);
                setTimeout(bombManager.tiempoExplo, Texplo, explo);
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explsión a la izquierda
        do{
            explo = new rectangulo(bX - bAlto*n - n, bY, bAncho, bAlto);
            tpm = bombManager.tocarBomb(explo);
            if(tpm.toco && tpm.bomba){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }else if(tpm.toco){
                break;
            }else{
                bombManager.explosions.push(explo);
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
    var eliminado = true;
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
            if(hit.chocarCon(block) && eliminado){
                retornar.toco = true;
                delete blockManager.blocks[blockManager.blocks.indexOf(block)];
                eliminado = false;
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
    if(bombManager.explosions.indexOf(explo) != -1){
        delete bombManager.explosions[bombManager.explosions.indexOf(explo)];
    }
}

io.on('newBomb', function(data){
    if(data.id == playerManager.id)bombManager.puesta = false; 
    bombManager.colocarBomba(data);
});