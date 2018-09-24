class bomb {
    constructor(x, y, time, large){
        this.x = x;
        this.y = y;
        this.time = time;
        this.large = large;
        this.img = new Image();
        this.img.src = 'img/bomb.png';
        this.ancho = 32;
        this.alto = 32;
        this.tmp = null;
        this.recienColocada = true;
        this.coloca = null;
        this.hitbox = new rectangulo(this.x , this.y , this.ancho , this.alto);
    }
    Draw(ctx){
        if(camera.x - 32 < this.x && camera.x + camera.w > this.x &&
            camera.y - 32 < this.y && camera.y + camera.h > this.y){
            ctx.drawImage(this.img, this.x, this.y);
            if(debug.hit) this.hitbox.Draw(ctx);
        }
    }
}