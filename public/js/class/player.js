class player{
    constructor(id, x, y, vel, personaje, posHitX, posHitY, anchoHit, altoHit, numBomb, timeBomb, largeBomb){
        this.imagenes = animationManager.imagenes[personaje];
        this.personaje = personaje;
        this.id = id;
        this.x = x;
        this.vel = vel;
        this.y = y;
        this.posHitX = posHitX;
        this.posHitY = posHitY;
        this.anchoHit = anchoHit;
        this.altoHit = altoHit;
        this.hitbox = new rectangulo(this.x + posHitX, this.y + posHitY, anchoHit, altoHit);
        this.numBomb = numBomb;
        this.numMaxBomb = numBomb;
        this.timeBomb = timeBomb;
        this.largeBomb = largeBomb;
        this.speedImage = (0.09*this.vel)/3;
        this.animaciones = new animation(this.imagenes, this.speedImage);
        this.dir = dir.QUIETO;
        this.morir = false;
        this.atra = false;
        this.user = "";
    }
    Update(){
        if(this.dir == dir.ABAJO){
            this.animaciones.Update(0, 2);
        }
        else if(this.dir == dir.ARRIBA){
            this.animaciones.Update(3, 5);
        }
        else if(this.dir == dir.IZQUIERDA){
            this.animaciones.Update(6, 8);
        }
        else if(this.dir == dir.DERECHA){
            this.animaciones.Update(15, 17);
        }else if(this.animaciones != null){
            this.animaciones.Update(0, 0);
        }
    }
    Draw(ctx){
        if(this.user != ""){
            if(camera.x - 32 < this.x && camera.x + camera.w > this.x &&
                camera.y - 32 < this.y && camera.y + camera.h > this.y){
                if(this.animaciones.img[0] != null){
                    ctx.fillStyle = "white";
                    ctx.font="30px";
                    
                    let text = ""+this.user;
                    let width = ctx.measureText(text).width;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(this.x - 5 + 37 - width, this.y-17 , width + 10 , 21);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(text, this.x + 37 - width , this.y);
                    this.animaciones.Draw(ctx, this.x, this.y);
                    if(debug.hit)this.hitbox.Draw(ctx);
                }else{
                    console.log("Error, no se ha cargado las imagenes al objeto: ");
                    console.log(this);
                }
            }
        }
    }
    cambiarPos(x, y){
        this.hitbox.x = x;
        this.hitbox.y = y;
        this.x = x - this.posHitX;
        this.y = y - this.posHitY;
    }
    mov(velX, velY)
    {
        this.x+= velX;
        this.y+= velY;
        this.hitbox.x = this.x + this.posHitX;
        this.hitbox.y = this.y + this.posHitY;
    }
    igualar(data){
        this.morir = data.morir;
        this.animaciones.stop = data.animaciones.stop;
        this.x = data.x;
        this.y = data.y;
        this.hitbox.x = data.x + data.posHitX;
        this.hitbox.y = data.y + data.posHitY;
        this.dir = data.dir;
        this.vel = data.vel;
        this.personaje = data.personaje;
        this.numBomb = data.numBomb;
        this.numMaxBomb = data.numMaxBomb;
        this.timeBomb = data.timeBomb;
        this.largeBomb = data.largeBomb;
    }
}