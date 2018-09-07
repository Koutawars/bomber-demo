class bomb {
    constructor(x, y, time, large){
        this.x = x;
        this.y = y;
        this.time = time;
        this.large = large;
        this.img = new Image();
        this.img.src = 'img/bomb.png';
        this.ancho = 38;
        this.alto = 41;
        this.tmp = null;
        this.recienColocada = true;
        this.coloca = null;
        this.hitbox = new rectangulo(this.x , this.y , this.ancho , this.alto);
    }
    dibujar(ctx){
        ctx.drawImage(this.img, this.x, this.y);
        if(debug.hit) this.hitbox.dibujar(ctx);
    }
}