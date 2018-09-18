class rectangulo{
    constructor(x, y, ancho, alto){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }
    Draw(ctx){
        ctx.strokeStyle="rgb(250, 0, 0)"; // color de los trazos
        ctx.strokeRect(this.x,this.y, this.ancho, this.alto);
        ctx.fillStyle = 'rgba(250, 0, 0, 0.3)';
        ctx.fillRect(this.x,this.y,this.ancho, this.alto);
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
        if ((abajo < otraArriba) ||
               (arriba > otraAbajo) ||
               (derecha < otraizquierda) ||
               (izquierda > otraDerecha)) {
           chocar = false;
        }
        return chocar;
    }

    puntoCon(x , y) {
        var izquierda = this.x;
        var derecha = this.x + (this.ancho);
        var arriba = this.y;
        var abajo = this.y + (this.alto);

        var chocar = false;
        if (x >= izquierda && x <= derecha && y <= abajo && y >= arriba) {
           chocar = true;
        }
        return chocar;
    }
}