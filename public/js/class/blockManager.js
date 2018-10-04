var blockManager = {
    blocks:[],
    paredes:[],
    grass:[],
    animationBlocks:[],
    w:32,
    h:32,
    callback:null
};
blockManager.LoadContent = function(){};
blockManager.Draw = function(ctx){
    this.grass.forEach(grass => {
        if(camera.x - 32 < grass.x && camera.x + camera.w > grass.x &&
            camera.y - 32 < grass.y && camera.y + camera.h > grass.y){
            ctx.drawImage(animationManager.imagenes['grass'][0], grass.x, grass.y);
        }
    });
    this.blocks.forEach(block => {
        if(camera.x - 32 < block.x && camera.x + camera.w > block.x &&
            camera.y - 32 < block.y && camera.y + camera.h > block.y){
            let index = this.blocks.indexOf(block);
            this.animationBlocks[index].Draw(ctx, block.x, block.y);
            if(debug.hit)block.Draw(ctx);
        }
    });
    this.paredes.forEach(pared => {
        if(camera.x - 32 < pared.x && camera.x + camera.w > pared.x &&
            camera.y - 32 < pared.y && camera.y + camera.h > pared.y){
            ctx.drawImage(animationManager.imagenes['pared'][0], pared.x, pared.y);
            if(debug.hit)pared.Draw(ctx);
        }
    });
};
blockManager.Update = function(){
    this.blocks.forEach(block => {
        let index = this.blocks.indexOf(block);
        if(!block.dead)this.animationBlocks[index].index = 0;
        else{
            this.animationBlocks[index].Update(0,6);
            if(this.animationBlocks[index].countReset >= 1){
                powerManager.generatePower(block.x, block.y, powerManager.pos_powers[index], index);
                delete this.blocks[index];
            }
        }
    });
};
io.on('mapa', function(data){
    let vector = data["data"];
    blockManager.widthmap = data["width"];
    let posX = 0;
    let posY = 0;
    for(let i = 0; i < vector.length; i++){
        if(vector[i] == 2){
            blockManager.animationBlocks[i] = new animation(animationManager.imagenes["block"], 0.25);
            blockManager.animationBlocks[i].stop = true;
            blockManager.blocks[i] = new rectangulo( posX, posY, blockManager.w, blockManager.h);
            blockManager.blocks[i].dead = false;
        }
        if(vector[i] == 1){
            blockManager.paredes[i] = new rectangulo( posX, posY, blockManager.w, blockManager.h);
        }
        if(vector[i] == 0 || vector[i] == 2)
            blockManager.grass[i] = {x:posX, y:posY};
        posX += 32;
        if((i+1)%data["width"] == 0){
            posY += 32;
            posX = 0;
        }
    }
    io.emit('powers');
    screenManager.check.block = true;
});
io.on('destroyBlock', function(data){
    blockManager.blocks[data].dead = true;
    blockManager.animationBlocks[data].stop = false;
});