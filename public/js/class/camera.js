var camera = {
    x: 0, 
    y: 0, 
    w: canvas.width, 
    h: canvas.height,
    player: null
};
camera.follow = function(player){
    this.player = player;
}
camera.Update = function (){
    if(this.player){
        this.x = this.player.hitbox.x - (this.w / 2);
        this.y = this.player.hitbox.y - (this.h / 2);
    }
}
camera.Draw = function(c){
    if(debug.hit){
        c.beginPath();
        c.rect(this.x, this.y, this.w, this.h);
        c.stroke();
    }
}