var powerManager = {
    powers:[],
    pos_powers:[],
    type:{
        speed: 0,
        bomb: 1
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
                case this.type.speed:
                    ctx.drawImage(imgPower[0],power.x, power.y);
                break;
                case this.type.bomb:
                    ctx.drawImage(imgPower[2],power.x, power.y);
                break;
            }
            if(debug.hit)power.Draw(ctx);
        }
    });
};

powerManager.Update = function(){
    this.powers.forEach(power => {
        playerManager.personajes.forEach(player => {
            if(player.hitbox.chocarCon(power)){
                if(player.power){
                    player.power.push(power.type);
                }else{
                    player.power = [];
                    player.power.push(power.type);
                }
                let index = this.powers.indexOf(power);
                delete this.powers[index];
                io.emit('eliminatePower', index);
                this.pos_powers[index] = -1;
            }
        });
    });
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
            // tira todos sus poderes en su posición x y y
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