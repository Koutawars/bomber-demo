class player{
    constructor(id, x, y, ruta, posHitX, posHitY, anchoHit, altoHit, numBomb, timeBomb, largeBomb){
        this.img = new Image();
        this.img.src = ruta;
        this.ruta = ruta;
        this.id = id;
        this.x = x;
        this.y = y;
        this.ancho = this.img.width;
        this.alto = this.img.height;
        this.posHitX = posHitX;
        this.posHitY = posHitY;
        this.hitbox = new rectangulo(this.x + posHitX, this.y + posHitY, anchoHit, altoHit);
        this.numBomb = numBomb;
        this.timeBomb = timeBomb;
        this.largeBomb = largeBomb;
    }
    dibujar(ctx){
        if(this.img != null){
            ctx.drawImage(this.img, this.x, this.y);
            if(debug.hit) this.hitbox.dibujar(ctx);
        }else{
            console.log("Error, no se ha cargado imagen al objeto: ");
            console.log(this);
        }
    }
    mover( velX, velY){
        this.x += velX;
        this.hitbox.x = this.x + this.posHitX;
        this.y += velY;
        this.hitbox.y = this.y + this.posHitY;
    }   
}