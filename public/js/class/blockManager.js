var blockManager = {
    blocks:[]
};
blockManager.LoadContent = function(){
    this.blocks.push(new rectangulo(100,100,32,32));
}
blockManager.Draw = function(ctx){
    this.blocks.forEach(block => {
        ctx.drawImage(animationManager.imagenes["block"][0], block.x, block.y);
    });
}

blockManager.Update = function(){
}