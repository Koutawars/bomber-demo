class player{
    constructor(id, x, y, vel, ruta, numImages, posHitX, posHitY, anchoHit, altoHit, numBomb, timeBomb, largeBomb){
        this.ruta = ruta;
        this.numImages = numImages;
        this.id = id;
        this.x = x;
        this.vel = vel;
        this.velTmp = vel;
        this.y = y;
        this.posHitX = posHitX;
        this.posHitY = posHitY;
        this.hitbox = new rectangulo(this.x + posHitX, this.y + posHitY, anchoHit, altoHit);
        this.numBomb = numBomb;
        this.timeBomb = timeBomb;
        this.largeBomb = largeBomb;
        this.animaciones = new animation(this.ruta, this.numImages, this.x, this.y);
        this.arriba = false;
        this.derecha = false;
        this.izquierda = false;
        this.abajo = false;
    }
    dibujar(ctx){
        if(this.animaciones.img[0] != null){
            if(this.abajo){
                this.animaciones.draw(0, 2, ctx, this.x, this.y);
            }
            else if(this.arriba){
                this.animaciones.draw(3, 5, ctx, this.x, this.y);
            }
            else if(this.izquierda){
                this.animaciones.draw(6, 8, ctx, this.x, this.y);
            }
            else if(this.derecha){
                this.animaciones.draw(15, 17, ctx, this.x, this.y);
            }else if(this.animaciones.stop){
                this.animaciones.draw(0, 0 ,ctx, this.x, this.y);
            }
            if(debug.hit) this.hitbox.dibujar(ctx);
        }else{
            console.log("Error, no se ha cargado las imagenes al objeto: ");
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