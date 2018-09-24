class rectangulo{
    constructor(x, y, ancho, alto){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }
    Draw(ctx){
        if(camera.x - 32 < this.x && camera.x + camera.w > this.x &&
            camera.y - 32 < this.y && camera.y + camera.h > this.y){
            ctx.strokeStyle="rgb(250, 0, 0)"; // color de los trazos
            ctx.strokeRect(this.x,this.y, this.ancho, this.alto);
            ctx.fillStyle = 'rgba(250, 0, 0, 0.3)';
            ctx.fillRect(this.x,this.y,this.ancho, this.alto);
        }
    }
    copiar(){
        return new rectangulo(this.x, this.y, this.ancho, this.alto);
    }
    chocarCon(otherobj) {
       var izquierda = this.x;
       var derecha = this.x + (this.ancho);
       var arriba = this.y;
       var abajo = this.y + (this.alto);
       var otraizquierda = otherobj.x;
       var otraDerecha = otherobj.x + (otherobj.ancho);
       var otraArriba = otherobj.y;
       var otraAbajo = otherobj.y + (otherobj.alto);
       var chocar = true;
       if ((abajo <= otraArriba) ||
              (arriba >= otraAbajo) ||
              (derecha <= otraizquierda) ||
              (izquierda >= otraDerecha)) {
          chocar = false;
       }
       return chocar;
    }
}