var blockManager = {
    blocks:[],
    w:32,
    h:32,
    callback:null
};
blockManager.LoadContent = function(){};
blockManager.Draw = function(ctx){
    this.blocks.forEach(block => {
        ctx.drawImage(animationManager.imagenes["block"][0], block.x, block.y);
        if(debug.hit)block.Draw(ctx);
    });
};

blockManager.Update = function(){};
io.on('block', function(data){
    let posX = 0;
    let posY = 0;
    for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].length; j++){
            if(data[i][j] == 1){
                blockManager.blocks.push(new rectangulo(posX,posY, blockManager.w, blockManager.h));
            }
            posX += 32;
        }
        posX = 0;
        posY += 32;
    }
    screenManager.check.block = true;
});