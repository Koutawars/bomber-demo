var powerManager = {
    powers:[],
    pos_powers:[],
    type:{
        atra: 0,
        flame: 1,
        bomb: 2,
        speed: 3
    }
};

powerManager.LoadContent = function(){};

powerManager.Draw = function(ctx){
    let imgPower = animationManager.imagenes['poder'];
    this.powers.forEach(power => {
        // se imprime cada uno en pantalla
        if(camera.x - 32 < power.x && camera.x + camera.w > power.x &&
            camera.y - 32 < power.y && camera.y + camera.h > power.y){
            switch(power.type){
                case this.type.atra:
                    ctx.drawImage(imgPower[power.type],power.x, power.y);
                break;
                case this.type.flame:
                    ctx.drawImage(imgPower[power.type],power.x, power.y);
                break;
                case this.type.bomb:
                    ctx.drawImage(imgPower[power.type],power.x, power.y);
                break;
                case this.type.speed:
                    ctx.drawImage(imgPower[power.type],power.x, power.y);
                break;
            }
            if(debug.hit)power.Draw(ctx);
        }
    });
};

powerManager.Update = function(){
    let player = playerManager.personajes[playerManager.id];
    if(player){
        this.powers.forEach(power => {
            if(player.hitbox.chocarCon(power)){
                if(power.type != null){
                    if(player.power){
                        player.power.push(power.type);
                    }else{
                        player.power = [];
                        player.power.push(power.type);
                    }
                    let index = this.powers.indexOf(power);
                    powerManager.setPower(index, player.id);
                    delete this.powers[index];
                    io.emit('eliminatePower', index, player);
                    this.pos_powers[index] = -1;
                }
            }
        });
    }
};
powerManager.generatePower = function(x,y, type, index){
    if(type != -1){
        this.powers[index] = new rectangulo(x, y, 32, 32);
        this.powers[index].type = type;
    }
};
powerManager.dropPower = function(id){
    player = playerManager.personajes[id];
    if(player){
        if(player.power){
            let x, y;
            x = Math.floor(player.hitbox.x/32) * 32;
            y = Math.floor(player.hitbox.y/32) * 32;
        }
    }
}

io.on('generatePosPower', data => {
    powerManager.pos_powers[data.id] = data.type;
});
io.on('powers', data => {
    powerManager.pos_powers = data;
    powerManager.pos_powers.forEach(types => {
        let index = powerManager.pos_powers.indexOf(types);
        if(index == null || powerManager.pos_powers[index] == null){
            delete powerManager.pos_powers[index];
        }
    });
    powerManager.pos_powers.forEach(types => {
        let index = powerManager.pos_powers.indexOf(types);
        let posX = 0;
        let posY = 0;
        for(let i = 0; i < index; i++){
            posX += 32;
            if((i+1)%blockManager.widthmap == 0){
                posY += 32;
                posX = 0;
            }
        }
        powerManager.generatePower(posX, posY, types, index);
    });
    screenManager.check.power = true;
});
powerManager.setPower = (indexPower, indexPlayer) => {
    let player = playerManager.personajes[indexPlayer];
    switch(powerManager.powers[indexPower].type){
        case powerManager.type.atra:
            player.atra = true;
        break;
        case powerManager.type.flame:
            player.largeBomb+=1;
        break;
        case powerManager.type.bomb:
            player.numMaxBomb +=1;
            player.numBomb +=1;
        break;
        case powerManager.type.speed:
            player.vel += 0.5;
        break;
    }
};
io.on('actualizarPower', function(data, index){
    let player = playerManager.personajes[data.id];
    powerManager.setPower(index, player.id);
    delete powerManager.powers[index];
});