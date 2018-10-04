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
            bombManager.animationExplo[index].Update(0,3);
        break;
        case this.type.TOPMID:
        bombManager.animationExplo[index].Update(24,27);
        break;
        case this.type.BOTMID:
        bombManager.animationExplo[index].Update(24,27);
        break;
        case this.type.LEFTMID:
        bombManager.animationExplo[index].Update(20,23);
        break;
        case this.type.RIGHTMID:
        bombManager.animationExplo[index].Update(20,23);
        break;
        case this.type.RIGHT:
        bombManager.animationExplo[index].Update(4,7);
        break;
        case this.type.LEFT:
        bombManager.animationExplo[index].Update(12,15);
        break;
        case this.type.TOP:
        bombManager.animationExplo[index].Update(8,11);
        break;
        case this.type.BOT:
        bombManager.animationExplo[index].Update(16,19);
        break;
    }
    if(bombManager.animationExplo[index])bombManager.animationExplo[index].Draw(ctx, bombManager.explosions[index].x, bombManager.explosions[index].y);
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
            if(player.hitbox.chocarCon(explo) && this.user != "" && !player.morir){
                player.morir = true;
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
        var Texplo = 550; // tiempo que dura las explosiones
        var explo = new rectangulo(bX, bY, bAncho, bAlto); // se crea una explosión
        var index;
        var velocityAnimation = 0.14;
        index = bombManager.explosions.push(explo) - 1;
        bombManager.typeExplo[index] = bombManager.type.CENTER;
        bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], velocityAnimation);
        bombManager.animationExplo[index].stop = false;
        setTimeout(bombManager.tiempoExplo, Texplo, explo);
        var tpm;
        let angulo = 0, cos, sin;
        for(var i = 0; i < 4; i++){ 
            n = 1;
            angulo = Math.PI*(i/2);
            cos = Math.round(Math.cos(angulo));
            sin = Math.round(Math.sin(angulo));
            do{
                explo = new rectangulo(bX + bAlto*n*cos, bY + bAlto*n*sin, bAncho, bAlto);
                tpm = bombManager.tocarBomb(explo);
                if(tpm.toco && tpm.bomba){
                    clearTimeout(tpm.bomba.tmp);
                    bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                    break;
                }else if(tpm.toco){
                    break;
                }else{
                    index = bombManager.explosions.push(explo) - 1;
                    if(coloca.largeBomb == n){
                        if(cos == 1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.RIGHT;
                        if(cos == 0 && sin == -1)
                            bombManager.typeExplo[index] = bombManager.type.TOP;
                        if(cos == -1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.LEFT;
                        if(cos == 0 && sin == 1)
                            bombManager.typeExplo[index] = bombManager.type.BOT;
                    }else{
                        if(cos == 1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.RIGHTMID;
                        if(cos == 0 && sin == -1)
                            bombManager.typeExplo[index] = bombManager.type.TOPMID;
                        if(cos == -1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.LEFTMID;
                        if(cos == 0 && sin == 1)
                            bombManager.typeExplo[index] = bombManager.type.BOTMID;
                    }
                        bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], velocityAnimation);
                        bombManager.animationExplo[index].stop = false;
                    setTimeout(bombManager.tiempoExplo, Texplo, explo);
                }
                n++;
            }while(n < coloca.largeBomb + 1);
        }
        if(playerManager.personajes[playerManager.id])
            if(playerManager.personajes[playerManager.id].numBomb <= playerManager.personajes[playerManager.id].numMaxBomb)
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
                blockManager.blocks[index].dead = true;
                blockManager.animationBlocks[index].stop = false;
                encontro = false;
            }
        });
    }
    if(!retornar.toco){
        blockManager.paredes.forEach(pared => {
            if(hit.chocarCon(pared)){
                retornar.toco = true;
            }
        });
    }
    if(!retornar.toco){
        powerManager.powers.forEach(power => {
            if(hit.chocarCon(power)){
                retornar.toco = true;
                let index = powerManager.powers.indexOf(power);
                delete powerManager.powers[index];
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
    blockManager.blocks.forEach(block => {
        if(block.chocarCon(hit))
            retornar = true;
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